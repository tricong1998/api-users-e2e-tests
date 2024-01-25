export type PinoRedactConfig = {
  enabled: boolean;
  paths: string[];
  censor?: any;
};

export type PinoConfig = {
  enabled?: boolean;
  redact?: PinoRedactConfig;
};
