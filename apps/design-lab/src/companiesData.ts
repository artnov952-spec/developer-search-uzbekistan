/* Демо-данные раздела «Компании» (по образцу Cloudplus CRM). Вымышленные, без реальных ПДн. */

export type CompanyStatus = 'active' | 'no-contact' | 'inactive'

export interface Company {
  id: string
  name: string
  status: CompanyStatus
  owner: string | null
  contact: string
  createdDays: number // сколько дней назад создана
}

export const companyStatusLabel: Record<CompanyStatus, string> = {
  active: 'В работе',
  'no-contact': 'Контакта не было',
  inactive: 'Не в работе',
}

export const companyStatusVariant: Record<CompanyStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  'no-contact': 'secondary',
  inactive: 'outline',
}

export const companyOwners = [
  'Дамиров Бехрузбек',
  'Советбаева Сабина',
  'Логунов Артём',
  'Ким Рустам',
  'Ветрова Ольга',
]

export const companies: Company[] = [
  { id: 'c1', name: 'ООО "SAID INVEST GROUP"', status: 'active', owner: 'Дамиров Бехрузбек', contact: 'Без ФИО', createdDays: 1 },
  { id: 'c2', name: 'ИП ООО "UZTUR INVESTMENT AND DEVELOPMENT"', status: 'active', owner: 'Советбаева Сабина', contact: 'GUNDUZ ORHAN', createdDays: 6 },
  { id: 'c3', name: 'ООО "XZLGO"', status: 'no-contact', owner: 'Советбаева Сабина', contact: 'LI JUN', createdDays: 6 },
  { id: 'c4', name: 'ООО "TEONA"', status: 'inactive', owner: null, contact: 'DZARDANOV ALAN SERGEEVICH', createdDays: 6 },
  { id: 'c5', name: 'ООО "ANGREN GUMAT KO\'MIR"', status: 'inactive', owner: null, contact: 'TASHPULATOV KAXRAMON', createdDays: 6 },
  { id: 'c6', name: 'ООО "G`IIO` TAYYORLOV"', status: 'inactive', owner: null, contact: 'XUSANOV ILXOMJON ABDULLAEVICH', createdDays: 6 },
  { id: 'c7', name: 'ООО "GAZEL HAYDA"', status: 'inactive', owner: null, contact: 'YUNUSOV ILXOMJON AKBAROVICH', createdDays: 6 },
  { id: 'c8', name: 'ООО "DONIX GROUP 777"', status: 'inactive', owner: null, contact: 'OMONBOYEV SHOXRUXBEK', createdDays: 6 },
  { id: 'c9', name: 'ООО "ALSER FATIH MAYA"', status: 'inactive', owner: null, contact: 'NIYAZOVA LAZOKAT SHUXRATOVNA', createdDays: 6 },
  { id: 'c10', name: 'ООО "AVALLON GOFRO BUSINESS"', status: 'inactive', owner: null, contact: 'SMADIYAROV NURG\'ALI ABDULLAEVICH', createdDays: 6 },
  { id: 'c11', name: 'ООО "CITYONE GRINT"', status: 'inactive', owner: null, contact: 'AKBAROV NAZIR IBROXIMOVICH', createdDays: 6 },
  { id: 'c12', name: 'ООО "GIZZA STYLE"', status: 'inactive', owner: null, contact: 'ISMADIYAROVA NARGIZA', createdDays: 6 },
  { id: 'c13', name: 'ООО "FITOS TRADING BUSINESS"', status: 'inactive', owner: null, contact: 'TOSHEVA DILFUZA ALIJONOVNA', createdDays: 6 },
  { id: 'c14', name: 'ООО "FLUENT-EDUCATION"', status: 'inactive', owner: null, contact: 'EZDINA EKATERINA YUREVNA', createdDays: 6 },
  { id: 'c15', name: 'ООО "FLARE SYSTEM RM"', status: 'inactive', owner: null, contact: 'XALILOV ABDUXALIL', createdDays: 6 },
  { id: 'c16', name: 'ООО "FOURS"', status: 'inactive', owner: null, contact: 'ADILOVA FERUZA GAFUROVNA', createdDays: 6 },
  { id: 'c17', name: 'ООО "GENUS-DEVELOP"', status: 'inactive', owner: null, contact: 'NE\'MATULLAYEV SIROJIDDIN', createdDays: 6 },
  { id: 'c18', name: 'ООО "ELIMA"', status: 'inactive', owner: null, contact: 'SHARAFUTDINOVA YELENA', createdDays: 6 },
  { id: 'c19', name: 'ООО "OZIQA"', status: 'inactive', owner: null, contact: 'Контактов нет', createdDays: 6 },
  { id: 'c20', name: 'ООО "FIELD FLARE FOOTBALL AGENCY"', status: 'inactive', owner: null, contact: 'DILMURODOV BOBIR NURILLAEVICH', createdDays: 6 },
  { id: 'c21', name: 'ООО "TASHKENT TRADE HOUSE"', status: 'active', owner: 'Логунов Артём', contact: 'ABDULLAEV TIMUR', createdDays: 2 },
  { id: 'c22', name: 'ООО "SILK ROAD LOGISTICS"', status: 'active', owner: 'Ким Рустам', contact: 'YULDASHEV OTABEK', createdDays: 3 },
  { id: 'c23', name: 'ООО "NUR TEXTILE"', status: 'no-contact', owner: 'Ветрова Ольга', contact: 'KARIMOVA GULNORA', createdDays: 4 },
  { id: 'c24', name: 'ООО "MEGA BUILD GROUP"', status: 'inactive', owner: null, contact: 'RAXIMOV DILSHOD', createdDays: 7 },
  { id: 'c25', name: 'ООО "ASIA FRESH FOODS"', status: 'active', owner: 'Дамиров Бехрузбек', contact: 'USMANOVA NIGORA', createdDays: 2 },
  { id: 'c26', name: 'ООО "DIGITAL WAY"', status: 'no-contact', owner: 'Логунов Артём', contact: 'SALIMOV BOBUR', createdDays: 5 },
  { id: 'c27', name: 'ООО "GREEN VALLEY AGRO"', status: 'active', owner: 'Советбаева Сабина', contact: 'MIRZAEVA ZUXRA', createdDays: 1 },
  { id: 'c28', name: 'ООО "PRIME MOTORS"', status: 'inactive', owner: null, contact: 'Без ФИО', createdDays: 8 },
  { id: 'c29', name: 'ООО "STAR MEDIA UZ"', status: 'inactive', owner: null, contact: 'IRISBAEVA GULNOZA', createdDays: 6 },
  { id: 'c30', name: 'ООО "OASIS TRADE"', status: 'active', owner: 'Ким Рустам', contact: 'AXMEDOV SANJAR', createdDays: 3 },
  { id: 'c31', name: 'ООО "TECHNO PARK SERVICE"', status: 'no-contact', owner: 'Ветрова Ольга', contact: 'NIZAMOV FARRUX', createdDays: 4 },
  { id: 'c32', name: 'ООО "CAPITAL FINANCE"', status: 'inactive', owner: null, contact: 'YUSUPOV MARAT', createdDays: 9 },
  { id: 'c33', name: 'ООО "BUKHARA CARPETS"', status: 'inactive', owner: null, contact: 'SHARIPOVA LOLA', createdDays: 6 },
  { id: 'c34', name: 'ООО "SMART HOME UZ"', status: 'active', owner: 'Логунов Артём', contact: 'KARIMOV AZIZ', createdDays: 2 },
  { id: 'c35', name: 'ООО "FERGANA FOODS"', status: 'inactive', owner: null, contact: 'Контактов нет', createdDays: 7 },
  { id: 'c36', name: 'ООО "ALLIANCE GROUP"', status: 'no-contact', owner: 'Дамиров Бехрузбек', contact: 'ROZIQOV JASUR', createdDays: 5 },
  { id: 'c37', name: 'ООО "URBAN DEVELOPERS"', status: 'inactive', owner: null, contact: 'TURGUNOV BEKZOD', createdDays: 6 },
  { id: 'c38', name: 'ООО "NAVOI MINING SERVICE"', status: 'active', owner: 'Советбаева Сабина', contact: 'ERGASHEV SARDOR', createdDays: 1 },
  { id: 'c39', name: 'ООО "PAYNET SOLUTIONS"', status: 'inactive', owner: null, contact: 'Без ФИО', createdDays: 10 },
  { id: 'c40', name: 'ООО "SAMARKAND WINE"', status: 'inactive', owner: null, contact: 'BEKMURODOV OYBEK', createdDays: 6 },
  { id: 'c41', name: 'ООО "EAST GATE TRADE"', status: 'active', owner: 'Ким Рустам', contact: 'SOBIROV ELDOR', createdDays: 3 },
  { id: 'c42', name: 'ООО "MEDLINE PHARMA"', status: 'no-contact', owner: 'Ветрова Ольга', contact: 'YAKUBOVA MADINA', createdDays: 4 },
  { id: 'c43', name: 'ООО "TITAN CONSTRUCTION"', status: 'inactive', owner: null, contact: 'XOLMATOV UMID', createdDays: 8 },
  { id: 'c44', name: 'ООО "BRIGHT FUTURE EDU"', status: 'active', owner: 'Логунов Артём', contact: 'ISLOMOVA SEVARA', createdDays: 2 },
]

export const totalCompanies = 2183
