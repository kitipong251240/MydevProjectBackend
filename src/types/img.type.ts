export interface Img {
  img_id?: number;
  img_filename?: string;
  img_disease: string;
  img_percent: number;
  img_symptom: string;
  img_user_id: number;
  img_patient_id: number;
  img_date?: Date;
  file?: any;
  file_obj?: URL | string;
}
