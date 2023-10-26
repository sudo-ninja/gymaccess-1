export class Attenshift {
    _id?:any;
    shiftname?:string;
    shift_start_time?:string;
    shift_end_time?:string;
    repeat?:boolean;
    holiday_list_id?:[]; // object id of holiday list

    day_number?: number;
    punchIn?:number;
    punchOut?:number;
    isHoliday?:boolean;
    creation_dt?:string; 
    
   }