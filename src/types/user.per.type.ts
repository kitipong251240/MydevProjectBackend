export interface UserPer {
  per_id?: number;
  per_name: string;
  access_diagnose: boolean;
  access_report: boolean;
  access_manageuser: boolean;
  access_position: boolean;
  access_patient: boolean;
  user_id?: number;
  user_user: string;
  user_pass?: string;
  user_fname: string;
  user_lname: string;
  user_phone: string;
  user_status?: number;
  user_per_id?: number;
}
