export interface Patient {
  patient_id?: number;
  patient_fname: string;
  patient_lname: string;
  patient_phone: string;
  patient_bdate?: Date;
  patient_sex: string;
  patient_status: number;
  patient_recent_id: number;
  patient_todate?: Date;
}
