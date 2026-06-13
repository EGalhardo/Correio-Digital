import React, { createContext, useContext, useState, useEffect } from 'react';
import { Institution, InstitutionCategory, InstitutionStatus } from '../types';

export const CANONICAL_INSTITUTIONS: Institution[] = [
  {
    id: "inst-agt",
    name: "AGT",
    fullName: "Administração Geral Tributária",
    category: InstitutionCategory.FINANCAS,
    province: "Luanda",
    municipio: "Ingombota",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 342400,
    totalAgents: 45,
    lastActivity: "Há 1 min",
    responseRate: "97.5%",
    registrationDate: "10/01/2025",
    aiUsageRate: "94%",
    performanceScore: "98.5%",
    contactEmail: "geral@agt.gov.ao",
    contactPhone: "+244 923 111 222",
    responsibleName: "Dr. Francisco Manuel",
    responsibleRole: "Presidente do Conselho",
    instCode: "AGT-001",
    typeInst: "Administração Geral",
    cidade: "Luanda (Capital)",
    comuna: "Maculusso"
  },
  {
    id: "inst-sme",
    name: "SME",
    fullName: "Serviço de Migração e Estrangeiros",
    category: InstitutionCategory.SEGURANCA,
    province: "Luanda",
    municipio: "Maianga",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 198250,
    totalAgents: 32,
    lastActivity: "Há 4 mins",
    responseRate: "94.2%",
    registrationDate: "15/02/2025",
    aiUsageRate: "88%",
    performanceScore: "95.0%",
    contactEmail: "geral@sme.gov.ao",
    contactPhone: "+244 923 000 000",
    responsibleName: "Dr. António Fernando",
    responsibleRole: "Director Geral",
    instCode: "SME-001",
    typeInst: "Serviço Público Regular",
    cidade: "Luanda (Capital)",
    comuna: "Maianga Sede"
  },
  {
    id: "inst-ende",
    name: "ENDE",
    fullName: "Empresa Nacional de Distribuição de Electricidade",
    category: InstitutionCategory.INFRAESTRUTURA,
    province: "Benguela",
    municipio: "Lobito",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 92100,
    totalAgents: 18,
    lastActivity: "Há 18 mins",
    responseRate: "89.0%",
    registrationDate: "01/03/2025",
    aiUsageRate: "76%",
    performanceScore: "88.5%",
    contactEmail: "suporte@ende.ao",
    contactPhone: "+244 912 345 678",
    responsibleName: "Dr. Manuel Rebelo",
    responsibleRole: "Adm. Executivo",
    instCode: "ENDE-002",
    typeInst: "Empresa Pública",
    cidade: "Lobito",
    comuna: "Lobito Sede"
  },
  {
    id: "inst-epal",
    name: "EPAL",
    fullName: "Empresa Pública de Águas de Luanda",
    category: InstitutionCategory.INFRAESTRUTURA,
    province: "Luanda",
    municipio: "Viana",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 84300,
    totalAgents: 12,
    lastActivity: "Há 22 mins",
    responseRate: "91.8%",
    registrationDate: "12/03/2025",
    aiUsageRate: "82%",
    performanceScore: "91.0%",
    contactEmail: "geral@epal.gov.ao",
    contactPhone: "+244 924 999 888",
    responsibleName: "Engª. Maria da Luz",
    responsibleRole: "Directora de Operações",
    instCode: "EPAL-001",
    typeInst: "Empresa Pública",
    cidade: "Viana",
    comuna: "Viana Sede"
  },
  {
    id: "inst-minjus",
    name: "MINJUS",
    fullName: "Ministério da Justiça e dos Direitos Humanos",
    category: InstitutionCategory.JUSTICA,
    province: "Huíla",
    municipio: "Lubango",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 184200,
    totalAgents: 28,
    lastActivity: "Há 8 mins",
    responseRate: "98.2%",
    registrationDate: "20/01/2025",
    aiUsageRate: "91%",
    performanceScore: "97.8%",
    contactEmail: "contacto@minjusdh.gov.ao",
    contactPhone: "+244 921 555 333",
    responsibleName: "Dr. Alberto António",
    responsibleRole: "Delegado Provincial",
    instCode: "MINJUS-005",
    typeInst: "Ministério",
    cidade: "Lubango (Capital)",
    comuna: "Lubango Sede"
  },
  {
    id: "inst-minsa",
    name: "MINSA",
    fullName: "Ministério da Saúde",
    category: InstitutionCategory.SAUDE,
    province: "Huambo",
    municipio: "Huambo",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 112400,
    totalAgents: 22,
    lastActivity: "Há 25 mins",
    responseRate: "92.5%",
    registrationDate: "05/04/2025",
    aiUsageRate: "84%",
    performanceScore: "92.1%",
    contactEmail: "provincial@minsa.gov.ao",
    contactPhone: "+244 922 888 777",
    responsibleName: "Dra. Isabel Cândida",
    responsibleRole: "Directora Clínica",
    instCode: "MINSA-002",
    typeInst: "Ministério",
    cidade: "Huambo (Capital)",
    comuna: "Huambo Sede"
  },
  {
    id: "inst-pna",
    name: "PNA",
    fullName: "Polícia Nacional de Angola",
    category: InstitutionCategory.SEGURANCA,
    province: "Cabinda",
    municipio: "Cabinda",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 76500,
    totalAgents: 15,
    lastActivity: "Há 2 dias",
    responseRate: "85.4%",
    registrationDate: "18/02/2025",
    aiUsageRate: "65%",
    performanceScore: "84.0%",
    contactEmail: "cabinda@pna.gov.ao",
    contactPhone: "+244 923 444 555",
    responsibleName: "Subcomissário João Bento",
    responsibleRole: "Comandante Provincial",
    instCode: "PNA-010",
    typeInst: "Força de Segurança",
    cidade: "Cabinda (Capital)",
    comuna: "Cabinda Sede"
  },
  {
    id: "inst-inss",
    name: "INSS",
    fullName: "Instituto Nacional de Segurança Social",
    category: InstitutionCategory.SERVICOS,
    province: "Luanda",
    municipio: "Cazenga",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 154200,
    totalAgents: 24,
    lastActivity: "Há 3 horas",
    responseRate: "93.0%",
    registrationDate: "12/03/2024",
    aiUsageRate: "79%",
    performanceScore: "94.2%",
    contactEmail: "suporte@inss.gov.ao",
    contactPhone: "+244 932 777 666",
    responsibleName: "Dra. Paula de Carvalho",
    responsibleRole: "Directora de Prestações",
    instCode: "INSS-001",
    typeInst: "Instituto Público",
    cidade: "Luanda (Capital)",
    comuna: "Cazenga Sede"
  },
  {
    id: "inst-cne",
    name: "CNE",
    fullName: "Comissão Nacional Eleitoral",
    category: InstitutionCategory.SERVICOS,
    province: "Luanda",
    municipio: "Ingombota",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 45000,
    totalAgents: 10,
    lastActivity: "Há 1 semana",
    responseRate: "90.0%",
    registrationDate: "22/07/2024",
    aiUsageRate: "45%",
    performanceScore: "89.5%",
    contactEmail: "apoio@cne.ao",
    contactPhone: "+244 925 111 222",
    responsibleName: "Dr. Manuel da Silva",
    responsibleRole: "Delegado Nacional",
    instCode: "CNE-001",
    typeInst: "Órgão Independente",
    cidade: "Luanda (Capital)",
    comuna: "Ingombota Sede"
  },
  {
    id: "inst-registocivil",
    name: "Registo Civil",
    fullName: "Conservatória do Registo Civil",
    category: InstitutionCategory.JUSTICA,
    province: "Luanda",
    municipio: "Belas",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 167800,
    totalAgents: 30,
    lastActivity: "Há 12 mins",
    responseRate: "96.4%",
    registrationDate: "14/01/2024",
    aiUsageRate: "89%",
    performanceScore: "95.5%",
    contactEmail: "registo.civil.belas@minjus.gov.ao",
    contactPhone: "+244 933 444 333",
    responsibleName: "Dra. Maria Fernanda",
    responsibleRole: "Conservadora Geral",
    instCode: "RC-002",
    typeInst: "Conservatória / Notariado",
    cidade: "Luanda (Capital)",
    comuna: "Talatona"
  },
  {
    id: "inst-notariado",
    name: "Notariado",
    fullName: "Repartição de Notariado de Luanda",
    category: InstitutionCategory.JUSTICA,
    province: "Luanda",
    municipio: "Maianga",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 89000,
    totalAgents: 14,
    lastActivity: "Há 45 mins",
    responseRate: "92.0%",
    registrationDate: "20/02/2024",
    aiUsageRate: "70%",
    performanceScore: "91.2%",
    contactEmail: "notariado.maianga@minjus.gov.ao",
    contactPhone: "+244 927 000 888",
    responsibleName: "Dr. Carlos de Matos",
    responsibleRole: "Notário Público do Estado",
    instCode: "NOT-001",
    typeInst: "Conservatória / Notariado",
    cidade: "Luanda (Capital)",
    comuna: "Maianga Central"
  },
  {
    id: "inst-tribunalcomarca",
    name: "Tribunal de Comarca",
    fullName: "Tribunal de Comarca de Luanda",
    category: InstitutionCategory.JUSTICA,
    province: "Luanda",
    municipio: "Talatona",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 184500,
    totalAgents: 40,
    lastActivity: "Há 15 mins",
    responseRate: "95.1%",
    registrationDate: "05/01/2024",
    aiUsageRate: "85%",
    performanceScore: "96.0%",
    contactEmail: "comarca.luanda@tribunais.gov.ao",
    contactPhone: "+244 929 111 999",
    responsibleName: "Dr. Adalberto Costa",
    responsibleRole: "Juiz Presidente de Comarca",
    instCode: "TRIB-CO-001",
    typeInst: "Tribunal de Justiça",
    cidade: "Luanda (Capital)",
    comuna: "Talatona Sede"
  },
  {
    id: "inst-universidadepub",
    name: "Universidade Pública",
    fullName: "Universidade Agostinho Neto (UAN)",
    category: InstitutionCategory.EDUCACAO,
    province: "Luanda",
    municipio: "Belas",
    status: InstitutionStatus.ATIVA,
    totalCorrespondence: 120500,
    totalAgents: 65,
    lastActivity: "Há 2 horas",
    responseRate: "87.8%",
    registrationDate: "10/05/2024",
    aiUsageRate: "62%",
    performanceScore: "89.0%",
    contactEmail: "reitoria@uan.ao",
    contactPhone: "+244 931 222 333",
    responsibleName: "Dr. João Sebastião",
    responsibleRole: "Reitor Académico",
    instCode: "UAN-001",
    typeInst: "Instituição de Ensino Superior",
    cidade: "Luanda (Capital)",
    comuna: "Campus Universitário"
  }
];

// Helper to filter, list, group institutions
export const listInstitutions = (list: Institution[]) => list;

export const filterInstitutions = (
  list: Institution[],
  search: string,
  category: string,
  status: string,
  province: string
) => {
  return list.filter(inst => {
    // Search
    const matchSearch = 
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (inst.responsibleName && inst.responsibleName.toLowerCase().includes(search.toLowerCase())) ||
      inst.id.toLowerCase().includes(search.toLowerCase());
    
    // Category
    const matchCategory = category === 'Todas' || category === '' || inst.category === category;
    
    // Status
    const matchStatus = status === 'Todos' || status === '' || inst.status === status;
    
    // Province
    const matchProvince = province === 'Todas' || province === '' || inst.province === province;

    return matchSearch && matchCategory && matchStatus && matchProvince;
  });
};

export const groupInstitutionsByCategory = (list: Institution[]) => {
  return list.reduce((acc, inst) => {
    const cat = inst.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(inst);
    return acc;
  }, {} as Record<string, Institution[]>);
};

export const groupInstitutionsByProvince = (list: Institution[]) => {
  return list.reduce((acc, inst) => {
    const prov = inst.province;
    if (!acc[prov]) {
      acc[prov] = [];
    }
    acc[prov].push(inst);
    return acc;
  }, {} as Record<string, Institution[]>);
};

// Institutional Applet State Context
interface InstitutionContextType {
  institutions: Institution[];
  setInstitutions: React.Dispatch<React.SetStateAction<Institution[]>>;
  addInstitution: (inst: Omit<Institution, 'id' | 'totalCorrespondence' | 'totalAgents' | 'lastActivity' | 'responseRate' | 'registrationDate' | 'aiUsageRate' | 'performanceScore'>) => void;
  updateInstitutionStatus: (id: string, status: InstitutionStatus | string) => void;
  getInstitutionByName: (name: string) => Institution | undefined;
  getInstitutionById: (id: string) => Institution | undefined;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem("correio_digital_institutions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return CANONICAL_INSTITUTIONS;
  });

  useEffect(() => {
    localStorage.setItem("correio_digital_institutions", JSON.stringify(institutions));
  }, [institutions]);

  const addInstitution = (newFields: Omit<Institution, 'id' | 'totalCorrespondence' | 'totalAgents' | 'lastActivity' | 'responseRate' | 'registrationDate' | 'aiUsageRate' | 'performanceScore'>) => {
    const id = `inst-${newFields.name.toLowerCase()}-${Math.floor(Math.random() * 900) + 100}`;
    const newInst: Institution = {
      ...newFields,
      id,
      totalCorrespondence: 0,
      totalAgents: 1,
      lastActivity: "Agora mesmo",
      responseRate: "100%",
      registrationDate: new Date().toLocaleDateString('pt-AO'),
      aiUsageRate: "50%",
      performanceScore: "100%"
    };
    setInstitutions(prev => [...prev, newInst]);
  };

  const updateInstitutionStatus = (id: string, status: InstitutionStatus | string) => {
    setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status } : inst));
  };

  const getInstitutionByName = (name: string) => {
    return institutions.find(inst => inst.name.toLowerCase() === name.toLowerCase());
  };

  const getInstitutionById = (id: string) => {
    return institutions.find(inst => inst.id === id);
  };

  return React.createElement(
    InstitutionContext.Provider,
    {
      value: {
        institutions,
        setInstitutions,
        addInstitution,
        updateInstitutionStatus,
        getInstitutionByName,
        getInstitutionById
      }
    },
    children
  );
};

export const useInstitutions = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitutions must be used within an InstitutionProvider");
  }
  return context;
};
