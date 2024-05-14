export interface ImgPatient {
  patient_id?: number;
  patient_fname: string;
  patient_lname: string;
  patient_phone: string;
  patient_bdate?: Date;
  patient_sex: string;
  patient_status: number;
  patient_recent_id: number;

  patient_todate?: Date;
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
  result?: number;
}
