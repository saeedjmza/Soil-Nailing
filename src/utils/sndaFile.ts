/**
 * Strict *.SNDA Scenario Serialization, Validation & File I/O
 * Guarantees all user input parameters (metadata, system geometry, soil properties,
 * tendon, pullout, bearing plate, temporary/permanent facing, headed studs, corrosion tests)
 * are preserved completely and strictly saved/loaded with the *.snda extension.
 */
import { DesignState, FullCalculationResults, Language } from '../types/nailing';
import { normalizeDesignState } from '../constants/standardsData';
import { calculateAll } from './calculations';

export interface SndaScenarioFile {
  app: 'SoilNailDesignSuite';
  version: string;
  fileFormat: 'SNDA';
  savedAt: string;
  name: string;
  description: string;
  lang?: Language;
  metadata: DesignState['metadata'];
  state: DesignState;
  results: FullCalculationResults;
}

export interface ParsedSndaScenario {
  fileName: string;
  name: string;
  description: string;
  savedAt: string;
  lang?: Language;
  state: DesignState;
  results: FullCalculationResults;
}

export function isValidSndaFileName(fileName: string): boolean {
  return fileName.trim().toLowerCase().endsWith('.snda');
}

export function sanitizeSndaBaseName(rawName: string): string {
  const cleaned = rawName
    .replace(/\.snda$/i, '')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'SoilNail_Scenario';
}

export function buildSndaPayload(
  rawState: DesignState,
  options?: {
    name?: string;
    description?: string;
    lang?: Language;
    savedAt?: string;
  }
): SndaScenarioFile {
  const normalizedState = normalizeDesignState(rawState);
  const computedResults = calculateAll(normalizedState);
  const scenarioName =
    options?.name?.trim() ||
    normalizedState.metadata.projectName?.trim() ||
    normalizedState.metadata.projectNumber?.trim() ||
    'SoilNail_Scenario';
  const scenarioDesc =
    options?.description !== undefined
      ? options.description.trim()
      : normalizedState.metadata.notes?.trim() || '';

  return {
    app: 'SoilNailDesignSuite',
    version: '1.0',
    fileFormat: 'SNDA',
    savedAt: options?.savedAt || new Date().toISOString(),
    name: scenarioName,
    description: scenarioDesc,
    ...(options?.lang ? { lang: options.lang } : {}),
    metadata: normalizedState.metadata,
    state: normalizedState,
    results: computedResults,
  };
}

export function downloadSndaFile(
  rawState: DesignState,
  options?: {
    fileName?: string;
    name?: string;
    description?: string;
    lang?: Language;
    savedAt?: string;
  }
): string {
  const payload = buildSndaPayload(rawState, options);
  const baseName = sanitizeSndaBaseName(
    options?.fileName ||
      payload.name ||
      payload.state.metadata.projectName ||
      payload.state.metadata.projectNumber ||
      'SoilNail_Scenario'
  );
  const finalFileName = `${baseName}.snda`;

  const jsonContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = finalFileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return finalFileName;
}

export async function parseSndaFile(
  file: File,
  lang: Language
): Promise<ParsedSndaScenario> {
  if (!isValidSndaFileName(file.name)) {
    throw new Error(
      lang === 'fa'
        ? 'فرمت فایل مجاز نیست. سناریوها فقط با پسوند *.snda قابل فراخوانی هستند.'
        : 'Invalid file extension. Only scenario files with the *.snda extension are supported.'
    );
  }

  const rawText = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(
      lang === 'fa'
        ? 'فایل *.snda انتخاب‌شده معتبر نیست یا ساختار آن آسیب دیده است.'
        : 'The selected *.snda file is corrupted or not valid JSON.'
    );
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(
      lang === 'fa'
        ? 'ساختار سناریوی *.snda معتبر نیست.'
        : 'Invalid *.snda scenario file structure.'
    );
  }

  const record = parsed as Record<string, unknown>;
  const candidateState =
    record.state && typeof record.state === 'object'
      ? (record.state as Partial<DesignState>)
      : (record as Partial<DesignState>);

  if (
    !candidateState ||
    !candidateState.tendon ||
    !candidateState.pullout ||
    !candidateState.plate ||
    !candidateState.facing ||
    !candidateState.corrosion
  ) {
    throw new Error(
      lang === 'fa'
        ? 'فایل *.snda فاقد بخش‌های کامل ورودی طراحی نیلینگ است.'
        : 'The *.snda file does not contain complete Soil Nail design input sections.'
    );
  }

  const normalizedState = normalizeDesignState(candidateState as DesignState);
  const results = calculateAll(normalizedState);
  const name =
    (typeof record.name === 'string' && record.name.trim()) ||
    normalizedState.metadata.projectName?.trim() ||
    sanitizeSndaBaseName(file.name);
  const description =
    (typeof record.description === 'string' && record.description.trim()) ||
    normalizedState.metadata.notes?.trim() ||
    '';
  const savedAt =
    (typeof record.savedAt === 'string' && record.savedAt) ||
    new Date().toISOString();
  const parsedLang =
    record.lang === 'fa' || record.lang === 'en' ? record.lang : undefined;

  return {
    fileName: file.name,
    name,
    description,
    savedAt,
    lang: parsedLang,
    state: normalizedState,
    results,
  };
}
