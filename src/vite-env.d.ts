/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WSS_URL: string;
  readonly VITE_MINIO_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Clube {
  nome: string;
  ativo: boolean;
  cidade: string;
  id: number;
  logo?: string;
  membros: Usuario[];
}

type Role = "desbravador" | "administrador" | "diretoria" | "apoio" | "staff";

interface Usuario {
  id: number;
  clube: Clube;
  nome: string;
  aniversario: string;
  funcao: Role;
  clubeId: number;
  email: string;
  foto: string;
  presencas: any[];
  ativo: boolean;
}

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  pontos: number;
  inicio: string;
  fim: string;
}
