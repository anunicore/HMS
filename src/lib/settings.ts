export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/patient(.*)": ["patient"],
  "/doctor(.*)": ["doctor"],
  "/parent(.*)": ["parent"],
  "/list/doctors": ["admin", "doctor"],
  "/list/patients": ["admin", "doctor"],
  "/list/parents": ["admin", "doctor"],
  "/list/specialties": ["admin"],
  "/list/departments": ["admin", "doctor"],
  "/list/medicaldescriptions": ["admin", "doctor", "patient", "parent"],
  "/list/assignments": ["admin", "doctor", "patient", "parent"],
  "/list/medicalprescriptions": ["admin", "doctor", "patient", "parent"],
  "/list/attendance": ["admin", "doctor", "patient", "parent"],
  "/list/events": ["admin", "doctor", "patient", "parent"],
  "/list/announcements": ["admin", "doctor", "patient", "parent"],
};