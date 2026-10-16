import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AddValuationInput = {
  applicant?: InputMaybe<Scalars['String']['input']>;
  averageSquareMeter?: InputMaybe<Scalars['Float']['input']>;
  averageSquareYard?: InputMaybe<Scalars['Float']['input']>;
  averageValue?: InputMaybe<Scalars['Float']['input']>;
  improvementArea?: InputMaybe<Scalars['Float']['input']>;
  institution?: InputMaybe<UpdateInstitutionBelongsTo>;
  landArea?: InputMaybe<Scalars['Float']['input']>;
  landValue?: InputMaybe<Scalars['Float']['input']>;
  measuredAt?: InputMaybe<Scalars['Date']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  propertyId?: InputMaybe<Scalars['ID']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  riskProfile?: InputMaybe<RiskAggregates>;
  sector?: InputMaybe<Scalars['String']['input']>;
  utilizationRatio?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateInstitutionInput = {
  name: Scalars['String']['input'];
};

export type CreatePreAppraisalInput = {
  action?: InputMaybe<PreAppraisalCreateAction>;
  includeTargetProperty?: InputMaybe<Scalars['Boolean']['input']>;
  institutionId?: InputMaybe<Scalars['ID']['input']>;
  radiusMeters: Scalars['Int']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  sectorFilter: PreAppraisalSectorFilter;
  targetAddress?: InputMaybe<Scalars['String']['input']>;
  targetLatitude: Scalars['Float']['input'];
  targetLongitude: Scalars['Float']['input'];
  targetPropertyId?: InputMaybe<Scalars['ID']['input']>;
  timeFactor?: InputMaybe<Scalars['Float']['input']>;
  valuationDate?: InputMaybe<Scalars['Date']['input']>;
};

export type CreatePropertyInput = {
  cadastralKey?: InputMaybe<Scalars['String']['input']>;
  exactAddress?: InputMaybe<Scalars['String']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CreateRoleInput = {
  name: Scalars['String']['input'];
  permisos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  institutionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<UpdateRolesBelongsToMany>;
};

export type ExternalValuation = {
  __typename?: 'ExternalValuation';
  averageSquareYard?: Maybe<Scalars['Float']['output']>;
  averageValue?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  institutionName?: Maybe<Scalars['String']['output']>;
  isNewer: Scalars['Boolean']['output'];
  landArea?: Maybe<Scalars['Float']['output']>;
  measuredAt?: Maybe<Scalars['Date']['output']>;
  riskProfile?: Maybe<RiskAggregates>;
  sector?: Maybe<Scalars['String']['output']>;
};

export type ExternalValuationPage = {
  __typename?: 'ExternalValuationPage';
  currentPage: Scalars['Int']['output'];
  data: Array<ExternalValuation>;
  hasMorePages: Scalars['Boolean']['output'];
};

export type ExternalValuationSummary = {
  __typename?: 'ExternalValuationSummary';
  count: Scalars['Int']['output'];
  hasNewer: Scalars['Boolean']['output'];
};

export type Institution = {
  __typename?: 'Institution';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** A paginated list of Institution items. */
export type InstitutionPaginator = {
  __typename?: 'InstitutionPaginator';
  /** A list of Institution items. */
  data: Array<Institution>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPropertyValuation?: Maybe<PropertyValuation>;
  cancelPreAppraisal: PreAppraisal;
  createInstitution: Institution;
  createPreAppraisal: PreAppraisal;
  createProperty: Property;
  createRole: Role;
  createUser: User;
  deleteInstitution?: Maybe<Institution>;
  deletePreAppraisal: PreAppraisal;
  deleteProperty?: Maybe<Property>;
  deleteRole?: Maybe<Role>;
  deleteUser?: Maybe<User>;
  deleteValuation?: Maybe<PropertyValuation>;
  downloadPreAppraisalPdf: PreAppraisalPdfDownload;
  duplicatePreAppraisal: PreAppraisal;
  generatePreAppraisal: PreAppraisal;
  requestFormalPreAppraisal: PreAppraisal;
  updateInstitution: Institution;
  updatePreAppraisal: PreAppraisal;
  updateProperty: Property;
  updateRole: Role;
  updateUser: User;
  updateValuation?: Maybe<PropertyValuation>;
};


export type MutationAddPropertyValuationArgs = {
  input: AddValuationInput;
  propertyId: Scalars['ID']['input'];
};


export type MutationCancelPreAppraisalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateInstitutionArgs = {
  input: CreateInstitutionInput;
};


export type MutationCreatePreAppraisalArgs = {
  input: CreatePreAppraisalInput;
};


export type MutationCreatePropertyArgs = {
  input: CreatePropertyInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePreAppraisalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePropertyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteValuationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDownloadPreAppraisalPdfArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicatePreAppraisalArgs = {
  id: Scalars['ID']['input'];
  institutionId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationGeneratePreAppraisalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRequestFormalPreAppraisalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateInstitutionArgs = {
  input: UpdateInstitutionInput;
};


export type MutationUpdatePreAppraisalArgs = {
  input: UpdatePreAppraisalInput;
};


export type MutationUpdatePropertyArgs = {
  input: UpdatePropertyInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateValuationArgs = {
  input: UpdateValuationInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int']['output'];
  /** Index of the current page. */
  currentPage: Scalars['Int']['output'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']['output']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean']['output'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']['output']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output'];
  /** Number of items per page. */
  perPage: Scalars['Int']['output'];
  /** Number of total available items. */
  total: Scalars['Int']['output'];
};

export type PreAppraisal = {
  __typename?: 'PreAppraisal';
  annualAppreciationRate?: Maybe<Scalars['Float']['output']>;
  canDelete: Scalars['Boolean']['output'];
  canEdit: Scalars['Boolean']['output'];
  candidateCount: Scalars['Int']['output'];
  controlSamples: Array<PreAppraisalSample>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  expectedRiskProfile?: Maybe<RiskAggregates>;
  expectedRiskScore?: Maybe<Scalars['Float']['output']>;
  filters?: Maybe<Scalars['JSON']['output']>;
  financialSamples: Array<PreAppraisalSample>;
  generatedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  institution?: Maybe<Institution>;
  institutionId?: Maybe<Scalars['ID']['output']>;
  maxAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  minAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priceByYear?: Maybe<Scalars['JSON']['output']>;
  radiusMeters: Scalars['Int']['output'];
  recommendedAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  riskByYear?: Maybe<Scalars['JSON']['output']>;
  sampleCount: Scalars['Int']['output'];
  samples: Array<PreAppraisalSample>;
  sectorFilter: PreAppraisalSectorFilter;
  status: PreAppraisalStatus;
  targetAddress?: Maybe<Scalars['String']['output']>;
  targetLatitude: Scalars['Float']['output'];
  targetLongitude: Scalars['Float']['output'];
  targetProperty?: Maybe<Property>;
  targetPropertyId?: Maybe<Scalars['ID']['output']>;
  timeFactor: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['ID']['output'];
  uuid: Scalars['String']['output'];
  valuationDate?: Maybe<Scalars['Date']['output']>;
  valuationSelectionMode: PreAppraisalValuationSelectionMode;
  withinRadiusSamples: Array<PreAppraisalSample>;
};

export type PreAppraisalCalculationInput = {
  includeTargetProperty?: InputMaybe<Scalars['Boolean']['input']>;
  radiusMeters: Scalars['Int']['input'];
  sectorFilter: PreAppraisalSectorFilter;
  targetAddress?: InputMaybe<Scalars['String']['input']>;
  targetLatitude: Scalars['Float']['input'];
  targetLongitude: Scalars['Float']['input'];
  targetPropertyId?: InputMaybe<Scalars['ID']['input']>;
  timeFactor?: InputMaybe<Scalars['Float']['input']>;
  valuationDate?: InputMaybe<Scalars['Date']['input']>;
};

export enum PreAppraisalCreateAction {
  Generate = 'GENERATE',
  SaveDraft = 'SAVE_DRAFT'
}

export type PreAppraisalFilterInput = {
  createdFrom?: InputMaybe<Scalars['Date']['input']>;
  createdTo?: InputMaybe<Scalars['Date']['input']>;
  expectedRiskProfile?: InputMaybe<RiskAggregates>;
  generatedFrom?: InputMaybe<Scalars['Date']['input']>;
  generatedTo?: InputMaybe<Scalars['Date']['input']>;
  radiusMax?: InputMaybe<Scalars['Int']['input']>;
  radiusMin?: InputMaybe<Scalars['Int']['input']>;
  recommendedPriceMax?: InputMaybe<Scalars['Float']['input']>;
  recommendedPriceMin?: InputMaybe<Scalars['Float']['input']>;
  sampleCountMax?: InputMaybe<Scalars['Int']['input']>;
  sampleCountMin?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sectorFilter?: InputMaybe<PreAppraisalSectorFilter>;
  status?: InputMaybe<PreAppraisalStatus>;
  targetPropertyId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  valuationDateFrom?: InputMaybe<Scalars['Date']['input']>;
  valuationDateTo?: InputMaybe<Scalars['Date']['input']>;
  valuationSelectionMode?: InputMaybe<PreAppraisalValuationSelectionMode>;
};

export type PreAppraisalInstitutionOptions = {
  __typename?: 'PreAppraisalInstitutionOptions';
  canSelectNone: Scalars['Boolean']['output'];
  institutions: Array<Institution>;
};

export type PreAppraisalOrderByInput = {
  direction?: InputMaybe<SortDirection>;
  field: PreAppraisalOrderField;
};

export enum PreAppraisalOrderField {
  CreatedAt = 'CREATED_AT',
  GeneratedAt = 'GENERATED_AT',
  RadiusMeters = 'RADIUS_METERS',
  RecommendedAverageSquareYard = 'RECOMMENDED_AVERAGE_SQUARE_YARD',
  Reference = 'REFERENCE',
  SampleCount = 'SAMPLE_COUNT',
  SectorFilter = 'SECTOR_FILTER',
  Status = 'STATUS'
}

/** A paginated list of PreAppraisal items. */
export type PreAppraisalPaginator = {
  __typename?: 'PreAppraisalPaginator';
  /** A list of PreAppraisal items. */
  data: Array<PreAppraisal>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type PreAppraisalPdfDownload = {
  __typename?: 'PreAppraisalPdfDownload';
  contentBase64: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
};

export type PreAppraisalPreviewPayload = {
  __typename?: 'PreAppraisalPreviewPayload';
  annualAppreciationRate?: Maybe<Scalars['Float']['output']>;
  candidateCount: Scalars['Int']['output'];
  candidateLimitReached: Scalars['Boolean']['output'];
  excludedInvalidValuationCount: Scalars['Int']['output'];
  excludedWithoutSectorValuationCount: Scalars['Int']['output'];
  excludedWithoutValidValuationCount: Scalars['Int']['output'];
  excludedWithoutValuationsCount: Scalars['Int']['output'];
  expectedRiskProfile?: Maybe<RiskAggregates>;
  expectedRiskScore?: Maybe<Scalars['Float']['output']>;
  maxAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  minAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  priceByYear?: Maybe<Scalars['JSON']['output']>;
  propertiesWithinRadiusCount: Scalars['Int']['output'];
  radiusMeters: Scalars['Int']['output'];
  recommendedAverageSquareYard?: Maybe<Scalars['Float']['output']>;
  riskByYear?: Maybe<Scalars['JSON']['output']>;
  sampleCount: Scalars['Int']['output'];
  samples: Array<PreAppraisalPreviewSample>;
  sectorFilter: PreAppraisalSectorFilter;
  targetLatitude: Scalars['Float']['output'];
  targetLongitude: Scalars['Float']['output'];
  targetPropertyId?: Maybe<Scalars['ID']['output']>;
  timeFactor: Scalars['Float']['output'];
  valuationDate: Scalars['Date']['output'];
};

export type PreAppraisalPreviewSample = {
  __typename?: 'PreAppraisalPreviewSample';
  applicant?: Maybe<Scalars['String']['output']>;
  averageSquareMeter?: Maybe<Scalars['Float']['output']>;
  averageSquareYard?: Maybe<Scalars['Float']['output']>;
  averageValue?: Maybe<Scalars['Float']['output']>;
  cadastralKey?: Maybe<Scalars['String']['output']>;
  distanceMeters?: Maybe<Scalars['Float']['output']>;
  distanceWeight?: Maybe<Scalars['Float']['output']>;
  exactAddress?: Maybe<Scalars['String']['output']>;
  factor?: Maybe<Scalars['Float']['output']>;
  improvementArea?: Maybe<Scalars['Float']['output']>;
  institutionId?: Maybe<Scalars['ID']['output']>;
  isWithinRadius: Scalars['Boolean']['output'];
  landArea?: Maybe<Scalars['Float']['output']>;
  landValue?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  measuredAt?: Maybe<Scalars['Date']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  propertyName?: Maybe<Scalars['String']['output']>;
  propertyValuationId?: Maybe<Scalars['ID']['output']>;
  riskProfile?: Maybe<RiskAggregates>;
  riskScore?: Maybe<Scalars['Int']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  timeWeight?: Maybe<Scalars['Float']['output']>;
  utilizationRadio?: Maybe<Scalars['Float']['output']>;
  valuationAgeYears?: Maybe<Scalars['Float']['output']>;
  valuationReference?: Maybe<Scalars['String']['output']>;
  valuationSector?: Maybe<ValuationSector>;
  weightedPrice?: Maybe<Scalars['Float']['output']>;
  weightedRisk?: Maybe<Scalars['Float']['output']>;
};

export type PreAppraisalSample = {
  __typename?: 'PreAppraisalSample';
  applicant?: Maybe<Scalars['String']['output']>;
  averageSquareMeter?: Maybe<Scalars['Float']['output']>;
  averageSquareYard?: Maybe<Scalars['Float']['output']>;
  averageValue?: Maybe<Scalars['Float']['output']>;
  cadastralKey?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  distanceMeters?: Maybe<Scalars['Float']['output']>;
  distanceWeight?: Maybe<Scalars['Float']['output']>;
  exactAddress?: Maybe<Scalars['String']['output']>;
  factor?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  improvementArea?: Maybe<Scalars['Float']['output']>;
  institution?: Maybe<Institution>;
  institutionId?: Maybe<Scalars['ID']['output']>;
  isWithinRadius: Scalars['Boolean']['output'];
  landArea?: Maybe<Scalars['Float']['output']>;
  landValue?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  measuredAt?: Maybe<Scalars['Date']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  preAppraisal: PreAppraisal;
  preAppraisalId: Scalars['ID']['output'];
  property?: Maybe<Property>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  propertyName?: Maybe<Scalars['String']['output']>;
  propertyValuation?: Maybe<PropertyValuation>;
  propertyValuationId?: Maybe<Scalars['ID']['output']>;
  riskProfile?: Maybe<RiskAggregates>;
  riskScore?: Maybe<Scalars['Int']['output']>;
  sourceSnapshot?: Maybe<Scalars['JSON']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  timeWeight?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  utilizationRadio?: Maybe<Scalars['Float']['output']>;
  valuationAgeYears?: Maybe<Scalars['Float']['output']>;
  valuationReference?: Maybe<Scalars['String']['output']>;
  valuationSector?: Maybe<ValuationSector>;
  weightedPrice?: Maybe<Scalars['Float']['output']>;
  weightedRisk?: Maybe<Scalars['Float']['output']>;
};

export type PreAppraisalSampleLink = {
  __typename?: 'PreAppraisalSampleLink';
  propertyId: Scalars['ID']['output'];
  valuationId: Scalars['ID']['output'];
};

export enum PreAppraisalSectorFilter {
  Both = 'Both',
  Control = 'Control',
  Financiero = 'Financiero'
}

export enum PreAppraisalStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  FormalRequested = 'FORMAL_REQUESTED',
  Generated = 'GENERATED'
}

export enum PreAppraisalValuationSelectionMode {
  LatestPerProperty = 'LatestPerProperty',
  LatestPerSector = 'LatestPerSector'
}

export type Property = {
  __typename?: 'Property';
  cadastralKey?: Maybe<Scalars['String']['output']>;
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  canViewHistory: Scalars['Boolean']['output'];
  exactAddress?: Maybe<Scalars['String']['output']>;
  externalValuationSummary: ExternalValuationSummary;
  externalValuations: ExternalValuationPage;
  id: Scalars['ID']['output'];
  latestAuthorizedValuationDate?: Maybe<Scalars['Date']['output']>;
  latestFinancialValuation?: Maybe<PropertyValuation>;
  latestValuation?: Maybe<PropertyValuation>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  mapValuation?: Maybe<PropertyValuation>;
  name?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  user?: Maybe<User>;
  valuationHistory?: Maybe<PropertyValuationHistory>;
  valuations?: Maybe<Array<Maybe<PropertyValuation>>>;
};


export type PropertyExternalValuationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A paginated list of Property items. */
export type PropertyPaginator = {
  __typename?: 'PropertyPaginator';
  /** A list of Property items. */
  data: Array<Property>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type PropertyValuation = {
  __typename?: 'PropertyValuation';
  applicant?: Maybe<Scalars['String']['output']>;
  averageSquareMeter?: Maybe<Scalars['Float']['output']>;
  averageSquareYard?: Maybe<Scalars['Float']['output']>;
  averageValue?: Maybe<Scalars['Float']['output']>;
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  canEdit?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  improvementArea?: Maybe<Scalars['Float']['output']>;
  institution?: Maybe<Institution>;
  landArea?: Maybe<Scalars['Float']['output']>;
  landValue?: Maybe<Scalars['Float']['output']>;
  measuredAt?: Maybe<Scalars['Date']['output']>;
  owner?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  property_id?: Maybe<Scalars['ID']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  riskProfile?: Maybe<RiskAggregates>;
  sector?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  utilizationRatio?: Maybe<Scalars['Float']['output']>;
};

export type PropertyValuationHistory = {
  __typename?: 'PropertyValuationHistory';
  controlCount: Scalars['Int']['output'];
  financialCount: Scalars['Int']['output'];
  otherCount: Scalars['Int']['output'];
  riskPoints: Array<ValuationHistoryPoint>;
  total: Scalars['Int']['output'];
  valueChange?: Maybe<Scalars['Float']['output']>;
  valueChangePercent?: Maybe<Scalars['Float']['output']>;
  valuePoints: Array<ValuationHistoryPoint>;
};

export type Query = {
  __typename?: 'Query';
  hasGlobalInstitutionScope: Scalars['Boolean']['output'];
  institutionById?: Maybe<Institution>;
  institutions: InstitutionPaginator;
  preAppraisalById?: Maybe<PreAppraisal>;
  preAppraisalInstitutionOptions: PreAppraisalInstitutionOptions;
  preAppraisalSampleLinks: Array<PreAppraisalSampleLink>;
  preAppraisals: PreAppraisalPaginator;
  previewPreAppraisal: PreAppraisalPreviewPayload;
  properties: PropertyPaginator;
  propertiesWithinBounds: Array<Property>;
  propertiesWithinRadius: Array<Property>;
  propertyById?: Maybe<Property>;
  propertyMapDetails: Property;
  propertyValuationYears: Array<Scalars['Int']['output']>;
  roleById?: Maybe<Role>;
  roles: RolePaginator;
  user?: Maybe<User>;
  userById?: Maybe<User>;
  users: UserPaginator;
  valuationInstitutions: Array<Institution>;
};


export type QueryInstitutionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstitutionsArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPreAppraisalByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPreAppraisalSampleLinksArgs = {
  valuationIds: Array<Scalars['ID']['input']>;
};


export type QueryPreAppraisalsArgs = {
  filter?: InputMaybe<PreAppraisalFilterInput>;
  first?: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<PreAppraisalOrderByInput>>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPreviewPreAppraisalArgs = {
  input: PreAppraisalCalculationInput;
};


export type QueryPropertiesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  valuationYear?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPropertiesWithinBoundsArgs = {
  eastLongitude: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  northLatitude: Scalars['Float']['input'];
  southLatitude: Scalars['Float']['input'];
  westLongitude: Scalars['Float']['input'];
};


export type QueryPropertiesWithinRadiusArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusMeters?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPropertyByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPropertyMapDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoleByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRolesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum RiskAggregates {
  Excellent = 'Excellent',
  Fair = 'Fair',
  Good = 'Good',
  HighRisk = 'HighRisk',
  VeryGood = 'VeryGood'
}

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permisos: Array<Scalars['String']['output']>;
};

/** A paginated list of Role items. */
export type RolePaginator = {
  __typename?: 'RolePaginator';
  /** A list of Role items. */
  data: Array<Role>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateInstitutionBelongsTo = {
  connect?: InputMaybe<Scalars['ID']['input']>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateInstitutionInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePreAppraisalInput = {
  action?: InputMaybe<PreAppraisalCreateAction>;
  id: Scalars['ID']['input'];
  includeTargetProperty?: InputMaybe<Scalars['Boolean']['input']>;
  institutionId?: InputMaybe<Scalars['ID']['input']>;
  radiusMeters: Scalars['Int']['input'];
  sectorFilter: PreAppraisalSectorFilter;
  targetAddress?: InputMaybe<Scalars['String']['input']>;
  targetLatitude: Scalars['Float']['input'];
  targetLongitude: Scalars['Float']['input'];
  targetPropertyId?: InputMaybe<Scalars['ID']['input']>;
  timeFactor?: InputMaybe<Scalars['Float']['input']>;
  valuationDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdatePropertyInput = {
  cadastralKey?: InputMaybe<Scalars['String']['input']>;
  exactAddress?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type UpdateRoleInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  permisos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type UpdateRolesBelongsToMany = {
  connect?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  institutionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  permisos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  roles?: InputMaybe<UpdateRolesBelongsToMany>;
};

export type UpdateValuationInput = {
  applicant?: InputMaybe<Scalars['String']['input']>;
  averageSquareMeter?: InputMaybe<Scalars['Float']['input']>;
  averageSquareYard?: InputMaybe<Scalars['Float']['input']>;
  averageValue?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  improvementArea?: InputMaybe<Scalars['Float']['input']>;
  institution?: InputMaybe<UpdateInstitutionBelongsTo>;
  landArea?: InputMaybe<Scalars['Float']['input']>;
  landValue?: InputMaybe<Scalars['Float']['input']>;
  measuredAt?: InputMaybe<Scalars['Date']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  riskProfile?: InputMaybe<RiskAggregates>;
  sector?: InputMaybe<Scalars['String']['input']>;
  utilizationRatio?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institutions: Array<Institution>;
  name: Scalars['String']['output'];
  permisos?: Maybe<Array<Scalars['String']['output']>>;
  permisosExtra?: Maybe<Array<Scalars['String']['output']>>;
  roles: Array<Role>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type ValuationHistoryPoint = {
  __typename?: 'ValuationHistoryPoint';
  date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  sector?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export enum ValuationSector {
  Control = 'Control',
  Financiero = 'Financiero'
}

export type CreateInstitutionMutationVariables = Exact<{
  input: CreateInstitutionInput;
}>;


export type CreateInstitutionMutation = { __typename?: 'Mutation', createInstitution: { __typename?: 'Institution', id: string, name: string } };

export type UpdateInstitutionMutationVariables = Exact<{
  input: UpdateInstitutionInput;
}>;


export type UpdateInstitutionMutation = { __typename?: 'Mutation', updateInstitution: { __typename?: 'Institution', id: string, name: string } };

export type DeleteInstitutionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInstitutionMutation = { __typename?: 'Mutation', deleteInstitution?: { __typename?: 'Institution', id: string } | null };

export type ListInstitutionsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListInstitutionsQuery = { __typename?: 'Query', institutions: { __typename?: 'InstitutionPaginator', data: Array<{ __typename?: 'Institution', id: string, name: string }>, paginatorInfo: { __typename?: 'PaginatorInfo', currentPage: number, lastPage: number, total: number } } };

export type GetInstitutionByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstitutionByIdQuery = { __typename?: 'Query', institutionById?: { __typename?: 'Institution', id: string, name: string } | null };

export type CreatePreAppraisalMutationVariables = Exact<{
  input: CreatePreAppraisalInput;
}>;


export type CreatePreAppraisalMutation = { __typename?: 'Mutation', createPreAppraisal: { __typename?: 'PreAppraisal', id: string, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationDate?: any | null, candidateCount: number, sampleCount: number, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any } };

export type UpdatePreAppraisalMutationVariables = Exact<{
  input: UpdatePreAppraisalInput;
}>;


export type UpdatePreAppraisalMutation = { __typename?: 'Mutation', updatePreAppraisal: { __typename?: 'PreAppraisal', id: string, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationDate?: any | null, candidateCount: number, sampleCount: number, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any } };

export type GeneratePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GeneratePreAppraisalMutation = { __typename?: 'Mutation', generatePreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus, generatedAt?: any | null } };

export type CancelPreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelPreAppraisalMutation = { __typename?: 'Mutation', cancelPreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type DeletePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePreAppraisalMutation = { __typename?: 'Mutation', deletePreAppraisal: { __typename?: 'PreAppraisal', id: string } };

export type RequestFormalPreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RequestFormalPreAppraisalMutation = { __typename?: 'Mutation', requestFormalPreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type DuplicatePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DuplicatePreAppraisalMutation = { __typename?: 'Mutation', duplicatePreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type ListPreAppraisalsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PreAppraisalFilterInput>;
  orderBy?: InputMaybe<Array<PreAppraisalOrderByInput> | PreAppraisalOrderByInput>;
}>;


export type ListPreAppraisalsQuery = { __typename?: 'Query', preAppraisals: { __typename?: 'PreAppraisalPaginator', data: Array<{ __typename?: 'PreAppraisal', id: string, canEdit: boolean, canDelete: boolean, institutionId?: string | null, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationSelectionMode: PreAppraisalValuationSelectionMode, valuationDate?: any | null, candidateCount: number, sampleCount: number, minAverageSquareYard?: number | null, maxAverageSquareYard?: number | null, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any, targetProperty?: { __typename?: 'Property', id: string, name?: string | null, exactAddress?: string | null, cadastralKey?: string | null } | null, user: { __typename?: 'User', id: string, name: string } }>, paginatorInfo: { __typename?: 'PaginatorInfo', currentPage: number, lastPage: number, total: number } } };

export type GetPreAppraisalByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPreAppraisalByIdQuery = { __typename?: 'Query', preAppraisalById?: { __typename?: 'PreAppraisal', id: string, canEdit: boolean, canDelete: boolean, institutionId?: string | null, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationSelectionMode: PreAppraisalValuationSelectionMode, valuationDate?: any | null, timeFactor: number, candidateCount: number, sampleCount: number, minAverageSquareYard?: number | null, maxAverageSquareYard?: number | null, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, priceByYear?: any | null, riskByYear?: any | null, filters?: any | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any, samples: Array<{ __typename?: 'PreAppraisalSample', tag?: string | null, propertyId?: string | null, propertyValuationId?: string | null, institutionId?: string | null, propertyName?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude?: number | null, longitude?: number | null, valuationReference?: string | null, valuationSector?: ValuationSector | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, riskScore?: number | null, measuredAt?: any | null, distanceMeters?: number | null, isWithinRadius: boolean, valuationAgeYears?: number | null, timeWeight?: number | null, distanceWeight?: number | null, factor?: number | null, weightedPrice?: number | null, weightedRisk?: number | null }> } | null };

export type PreviewPreAppraisalQueryVariables = Exact<{
  input: PreAppraisalCalculationInput;
}>;


export type PreviewPreAppraisalQuery = { __typename?: 'Query', previewPreAppraisal: { __typename?: 'PreAppraisalPreviewPayload', targetPropertyId?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationDate: any, timeFactor: number, candidateCount: number, sampleCount: number, excludedWithoutValidValuationCount: number, minAverageSquareYard?: number | null, maxAverageSquareYard?: number | null, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, priceByYear?: any | null, riskByYear?: any | null, samples: Array<{ __typename?: 'PreAppraisalPreviewSample', tag?: string | null, propertyId?: string | null, propertyValuationId?: string | null, institutionId?: string | null, propertyName?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude?: number | null, longitude?: number | null, valuationReference?: string | null, valuationSector?: ValuationSector | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, riskScore?: number | null, measuredAt?: any | null, distanceMeters?: number | null, isWithinRadius: boolean, valuationAgeYears?: number | null, timeWeight?: number | null, distanceWeight?: number | null, factor?: number | null, weightedPrice?: number | null, weightedRisk?: number | null }> } };

export type CreatePropertyMutationVariables = Exact<{
  input: CreatePropertyInput;
}>;


export type CreatePropertyMutation = { __typename?: 'Mutation', createProperty: { __typename?: 'Property', id: string, name?: string | null } };

export type UpdatePropertyMutationVariables = Exact<{
  input: UpdatePropertyInput;
}>;


export type UpdatePropertyMutation = { __typename?: 'Mutation', updateProperty: { __typename?: 'Property', id: string, name?: string | null } };

export type AddPropertyValuationMutationVariables = Exact<{
  propertyId: Scalars['ID']['input'];
  input: AddValuationInput;
}>;


export type AddPropertyValuationMutation = { __typename?: 'Mutation', addPropertyValuation?: { __typename?: 'PropertyValuation', id: string } | null };

export type UpdatePropertyValuationMutationVariables = Exact<{
  input: UpdateValuationInput;
}>;


export type UpdatePropertyValuationMutation = { __typename?: 'Mutation', updateValuation?: { __typename?: 'PropertyValuation', id: string } | null };

export type DeletePropertyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePropertyMutation = { __typename?: 'Mutation', deleteProperty?: { __typename?: 'Property', id: string } | null };

export type DeleteValuationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteValuationMutation = { __typename?: 'Mutation', deleteValuation?: { __typename?: 'PropertyValuation', id: string } | null };

export type ListPropertiesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  valuationYear?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListPropertiesQuery = { __typename?: 'Query', properties: { __typename?: 'PropertyPaginator', data: Array<{ __typename?: 'Property', id: string, name?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude: number, longitude: number, quantity: number, latestValuation?: { __typename?: 'PropertyValuation', measuredAt?: any | null, institution?: { __typename?: 'Institution', name: string } | null } | null }>, paginatorInfo: { __typename?: 'PaginatorInfo', currentPage: number, lastPage: number, total: number } } };

export type GetPropertyByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPropertyByIdQuery = { __typename?: 'Query', propertyById?: { __typename?: 'Property', canEdit?: boolean | null, canDelete?: boolean | null, id: string, name?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude: number, longitude: number, quantity: number, valuationHistory?: { __typename?: 'PropertyValuationHistory', total: number, financialCount: number, controlCount: number, otherCount: number, valueChange?: number | null, valueChangePercent?: number | null, valuePoints: Array<{ __typename?: 'ValuationHistoryPoint', id: string, date: any, sector?: string | null, value: number }>, riskPoints: Array<{ __typename?: 'ValuationHistoryPoint', id: string, date: any, sector?: string | null, value: number }> } | null, latestValuation?: { __typename?: 'PropertyValuation', id: string } | null, valuations?: Array<{ __typename?: 'PropertyValuation', canEdit?: boolean | null, canDelete?: boolean | null, id: string, reference?: string | null, owner?: string | null, applicant?: string | null, phone?: string | null, sector?: string | null, averageValue?: number | null, measuredAt?: any | null, landArea?: number | null, improvementArea?: number | null, landValue?: number | null, utilizationRatio?: number | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, institution?: { __typename?: 'Institution', id: string, name: string } | null, user?: { __typename?: 'User', id: string, name: string } | null } | null> | null } | null };

export type GetPropertiesWithinRadiusQueryVariables = Exact<{
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  radiusMeters: Scalars['Int']['input'];
}>;


export type GetPropertiesWithinRadiusQuery = { __typename?: 'Query', propertiesWithinRadius: Array<{ __typename?: 'Property', id: string, name?: string | null, cadastralKey?: string | null, exactAddress?: string | null, latitude: number, longitude: number }> };

export type PropertyPointFieldsFragment = { __typename?: 'Property', canViewHistory: boolean, latestAuthorizedValuationDate?: any | null, id: string, name?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude: number, longitude: number, quantity: number, latestFinancialValuation?: { __typename?: 'PropertyValuation', reference?: string | null, sector?: string | null, averageValue?: number | null, landArea?: number | null, improvementArea?: number | null, landValue?: number | null, utilizationRatio?: number | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, measuredAt?: any | null, institution?: { __typename?: 'Institution', id: string, name: string } | null } | null };

export type PropertyValuationYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type PropertyValuationYearsQuery = { __typename?: 'Query', propertyValuationYears: Array<number> };

export type PropertyMapSummaryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PropertyMapSummaryQuery = { __typename?: 'Query', propertyMapDetails: { __typename?: 'Property', id: string, externalValuationSummary: { __typename?: 'ExternalValuationSummary', count: number, hasNewer: boolean } } };

export type PropertyExternalValuationsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  page: Scalars['Int']['input'];
}>;


export type PropertyExternalValuationsQuery = { __typename?: 'Query', propertyMapDetails: { __typename?: 'Property', id: string, externalValuations: { __typename?: 'ExternalValuationPage', currentPage: number, hasMorePages: boolean, data: Array<{ __typename?: 'ExternalValuation', id: string, institutionName?: string | null, measuredAt?: any | null, sector?: string | null, averageValue?: number | null, averageSquareYard?: number | null, landArea?: number | null, riskProfile?: RiskAggregates | null, isNewer: boolean }> } } };

export type ValuationInstitutionOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ValuationInstitutionOptionsQuery = { __typename?: 'Query', hasGlobalInstitutionScope: boolean, valuationInstitutions: Array<{ __typename?: 'Institution', id: string, name: string }> };

export type PropertiesWithinBoundsQueryVariables = Exact<{
  northLatitude: Scalars['Float']['input'];
  eastLongitude: Scalars['Float']['input'];
  southLatitude: Scalars['Float']['input'];
  westLongitude: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PropertiesWithinBoundsQuery = { __typename?: 'Query', propertiesWithinBounds: Array<{ __typename?: 'Property', canViewHistory: boolean, latestAuthorizedValuationDate?: any | null, id: string, name?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude: number, longitude: number, quantity: number, latestFinancialValuation?: { __typename?: 'PropertyValuation', reference?: string | null, sector?: string | null, averageValue?: number | null, landArea?: number | null, improvementArea?: number | null, landValue?: number | null, utilizationRatio?: number | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, measuredAt?: any | null, institution?: { __typename?: 'Institution', id: string, name: string } | null } | null }> };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'Role', id: string, name: string } };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'Role', id: string, name: string, permisos: Array<string> } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleteRole?: { __typename?: 'Role', id: string } | null };

export type ListRolesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListRolesQuery = { __typename?: 'Query', roles: { __typename?: 'RolePaginator', data: Array<{ __typename?: 'Role', id: string, name: string }>, paginatorInfo: { __typename?: 'PaginatorInfo', currentPage: number, lastPage: number, total: number } } };

export type GetRoleByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRoleByIdQuery = { __typename?: 'Query', roleById?: { __typename?: 'Role', id: string, name: string, permisos: Array<string> } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name: string, email: string, permisos?: Array<string> | null, permisosExtra?: Array<string> | null, institutions: Array<{ __typename?: 'Institution', id: string, name: string }>, roles: Array<{ __typename?: 'Role', id: string, name: string }> } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'User', id: string } | null };

export type ListUsersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListUsersQuery = { __typename?: 'Query', users: { __typename?: 'UserPaginator', data: Array<{ __typename?: 'User', id: string, name: string, roles: Array<{ __typename?: 'Role', id: string, name: string }> }>, paginatorInfo: { __typename?: 'PaginatorInfo', currentPage: number, lastPage: number, total: number } } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', userById?: { __typename?: 'User', id: string, name: string, email: string, permisos?: Array<string> | null, permisosExtra?: Array<string> | null, institutions: Array<{ __typename?: 'Institution', id: string, name: string }>, roles: Array<{ __typename?: 'Role', id: string, name: string }> } | null };

export type PreAppraisalInstitutionOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PreAppraisalInstitutionOptionsQuery = { __typename?: 'Query', preAppraisalInstitutionOptions: { __typename?: 'PreAppraisalInstitutionOptions', canSelectNone: boolean, institutions: Array<{ __typename?: 'Institution', id: string, name: string }> } };

export type PreAppraisalSampleLinksQueryVariables = Exact<{
  valuationIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type PreAppraisalSampleLinksQuery = { __typename?: 'Query', preAppraisalSampleLinks: Array<{ __typename?: 'PreAppraisalSampleLink', valuationId: string, propertyId: string }> };

export type GetPreAppraisalDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPreAppraisalDetailQuery = { __typename?: 'Query', preAppraisalById?: { __typename?: 'PreAppraisal', id: string, institutionId?: string | null, canEdit: boolean, canDelete: boolean, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationDate?: any | null, timeFactor: number, candidateCount: number, sampleCount: number, minAverageSquareYard?: number | null, maxAverageSquareYard?: number | null, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, priceByYear?: any | null, riskByYear?: any | null, filters?: any | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any, institution?: { __typename?: 'Institution', id: string, name: string } | null, samples: Array<{ __typename?: 'PreAppraisalSample', tag?: string | null, propertyId?: string | null, propertyValuationId?: string | null, institutionId?: string | null, propertyName?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude?: number | null, longitude?: number | null, valuationReference?: string | null, valuationSector?: ValuationSector | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, riskScore?: number | null, measuredAt?: any | null, distanceMeters?: number | null, isWithinRadius: boolean, valuationAgeYears?: number | null, timeWeight?: number | null, distanceWeight?: number | null, factor?: number | null, weightedPrice?: number | null, weightedRisk?: number | null }> } | null };

export type DetailGeneratePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailGeneratePreAppraisalMutation = { __typename?: 'Mutation', generatePreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus, generatedAt?: any | null } };

export type DetailCancelPreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailCancelPreAppraisalMutation = { __typename?: 'Mutation', cancelPreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type DetailDeletePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailDeletePreAppraisalMutation = { __typename?: 'Mutation', deletePreAppraisal: { __typename?: 'PreAppraisal', id: string } };

export type DetailRequestFormalPreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailRequestFormalPreAppraisalMutation = { __typename?: 'Mutation', requestFormalPreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type DetailDuplicatePreAppraisalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  institutionId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type DetailDuplicatePreAppraisalMutation = { __typename?: 'Mutation', duplicatePreAppraisal: { __typename?: 'PreAppraisal', id: string, status: PreAppraisalStatus } };

export type DetailDownloadPreAppraisalPdfMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DetailDownloadPreAppraisalPdfMutation = { __typename?: 'Mutation', downloadPreAppraisalPdf: { __typename?: 'PreAppraisalPdfDownload', filename: string, mimeType: string, contentBase64: string } };

export type EditGetPreAppraisalByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EditGetPreAppraisalByIdQuery = { __typename?: 'Query', preAppraisalById?: { __typename?: 'PreAppraisal', id: string, institutionId?: string | null, canEdit: boolean, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationSelectionMode: PreAppraisalValuationSelectionMode, valuationDate?: any | null, timeFactor: number, candidateCount: number, sampleCount: number, minAverageSquareYard?: number | null, maxAverageSquareYard?: number | null, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, priceByYear?: any | null, riskByYear?: any | null, filters?: any | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any, samples: Array<{ __typename?: 'PreAppraisalSample', tag?: string | null, propertyId?: string | null, propertyValuationId?: string | null, institutionId?: string | null, propertyName?: string | null, exactAddress?: string | null, cadastralKey?: string | null, latitude?: number | null, longitude?: number | null, valuationReference?: string | null, valuationSector?: ValuationSector | null, averageSquareYard?: number | null, averageSquareMeter?: number | null, riskProfile?: RiskAggregates | null, riskScore?: number | null, measuredAt?: any | null, distanceMeters?: number | null, isWithinRadius: boolean, valuationAgeYears?: number | null, timeWeight?: number | null, distanceWeight?: number | null, factor?: number | null, weightedPrice?: number | null, weightedRisk?: number | null }> } | null };

export type EditUpdatePreAppraisalMutationVariables = Exact<{
  input: UpdatePreAppraisalInput;
}>;


export type EditUpdatePreAppraisalMutation = { __typename?: 'Mutation', updatePreAppraisal: { __typename?: 'PreAppraisal', id: string, uuid: string, reference?: string | null, name?: string | null, targetAddress?: string | null, targetLatitude: number, targetLongitude: number, radiusMeters: number, sectorFilter: PreAppraisalSectorFilter, valuationDate?: any | null, candidateCount: number, sampleCount: number, recommendedAverageSquareYard?: number | null, expectedRiskScore?: number | null, expectedRiskProfile?: RiskAggregates | null, annualAppreciationRate?: number | null, status: PreAppraisalStatus, generatedAt?: any | null, createdAt: any } };

export const PropertyPointFieldsFragmentDoc = gql`
    fragment PropertyPointFields on Property {
  canViewHistory
  latestAuthorizedValuationDate
  id
  name
  exactAddress
  cadastralKey
  latitude
  longitude
  quantity
  latestFinancialValuation: mapValuation {
    institution {
      id
      name
    }
    reference
    sector
    averageValue
    landArea
    improvementArea
    landValue
    utilizationRatio
    averageSquareYard
    averageSquareMeter
    riskProfile
    measuredAt
  }
}
    `;
export const CreateInstitutionDocument = gql`
    mutation CreateInstitution($input: CreateInstitutionInput!) {
  createInstitution(input: $input) {
    id
    name
  }
}
    `;
export type CreateInstitutionMutationFn = Apollo.MutationFunction<CreateInstitutionMutation, CreateInstitutionMutationVariables>;

/**
 * __useCreateInstitutionMutation__
 *
 * To run a mutation, you first call `useCreateInstitutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInstitutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInstitutionMutation, { data, loading, error }] = useCreateInstitutionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInstitutionMutation(baseOptions?: Apollo.MutationHookOptions<CreateInstitutionMutation, CreateInstitutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInstitutionMutation, CreateInstitutionMutationVariables>(CreateInstitutionDocument, options);
      }
export type CreateInstitutionMutationHookResult = ReturnType<typeof useCreateInstitutionMutation>;
export type CreateInstitutionMutationResult = Apollo.MutationResult<CreateInstitutionMutation>;
export type CreateInstitutionMutationOptions = Apollo.BaseMutationOptions<CreateInstitutionMutation, CreateInstitutionMutationVariables>;
export const UpdateInstitutionDocument = gql`
    mutation UpdateInstitution($input: UpdateInstitutionInput!) {
  updateInstitution(input: $input) {
    id
    name
  }
}
    `;
export type UpdateInstitutionMutationFn = Apollo.MutationFunction<UpdateInstitutionMutation, UpdateInstitutionMutationVariables>;

/**
 * __useUpdateInstitutionMutation__
 *
 * To run a mutation, you first call `useUpdateInstitutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInstitutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInstitutionMutation, { data, loading, error }] = useUpdateInstitutionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInstitutionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInstitutionMutation, UpdateInstitutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInstitutionMutation, UpdateInstitutionMutationVariables>(UpdateInstitutionDocument, options);
      }
export type UpdateInstitutionMutationHookResult = ReturnType<typeof useUpdateInstitutionMutation>;
export type UpdateInstitutionMutationResult = Apollo.MutationResult<UpdateInstitutionMutation>;
export type UpdateInstitutionMutationOptions = Apollo.BaseMutationOptions<UpdateInstitutionMutation, UpdateInstitutionMutationVariables>;
export const DeleteInstitutionDocument = gql`
    mutation DeleteInstitution($id: ID!) {
  deleteInstitution(id: $id) {
    id
  }
}
    `;
export type DeleteInstitutionMutationFn = Apollo.MutationFunction<DeleteInstitutionMutation, DeleteInstitutionMutationVariables>;

/**
 * __useDeleteInstitutionMutation__
 *
 * To run a mutation, you first call `useDeleteInstitutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInstitutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInstitutionMutation, { data, loading, error }] = useDeleteInstitutionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteInstitutionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInstitutionMutation, DeleteInstitutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInstitutionMutation, DeleteInstitutionMutationVariables>(DeleteInstitutionDocument, options);
      }
export type DeleteInstitutionMutationHookResult = ReturnType<typeof useDeleteInstitutionMutation>;
export type DeleteInstitutionMutationResult = Apollo.MutationResult<DeleteInstitutionMutation>;
export type DeleteInstitutionMutationOptions = Apollo.BaseMutationOptions<DeleteInstitutionMutation, DeleteInstitutionMutationVariables>;
export const ListInstitutionsDocument = gql`
    query ListInstitutions($first: Int!, $page: Int, $search: String) {
  institutions(first: $first, page: $page, search: $search) {
    data {
      id
      name
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `;

/**
 * __useListInstitutionsQuery__
 *
 * To run a query within a React component, call `useListInstitutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListInstitutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListInstitutionsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListInstitutionsQuery(baseOptions: Apollo.QueryHookOptions<ListInstitutionsQuery, ListInstitutionsQueryVariables> & ({ variables: ListInstitutionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListInstitutionsQuery, ListInstitutionsQueryVariables>(ListInstitutionsDocument, options);
      }
export function useListInstitutionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListInstitutionsQuery, ListInstitutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListInstitutionsQuery, ListInstitutionsQueryVariables>(ListInstitutionsDocument, options);
        }
export function useListInstitutionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListInstitutionsQuery, ListInstitutionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListInstitutionsQuery, ListInstitutionsQueryVariables>(ListInstitutionsDocument, options);
        }
export type ListInstitutionsQueryHookResult = ReturnType<typeof useListInstitutionsQuery>;
export type ListInstitutionsLazyQueryHookResult = ReturnType<typeof useListInstitutionsLazyQuery>;
export type ListInstitutionsSuspenseQueryHookResult = ReturnType<typeof useListInstitutionsSuspenseQuery>;
export type ListInstitutionsQueryResult = Apollo.QueryResult<ListInstitutionsQuery, ListInstitutionsQueryVariables>;
export const GetInstitutionByIdDocument = gql`
    query GetInstitutionById($id: ID!) {
  institutionById(id: $id) {
    id
    name
  }
}
    `;

/**
 * __useGetInstitutionByIdQuery__
 *
 * To run a query within a React component, call `useGetInstitutionByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstitutionByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstitutionByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInstitutionByIdQuery(baseOptions: Apollo.QueryHookOptions<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables> & ({ variables: GetInstitutionByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>(GetInstitutionByIdDocument, options);
      }
export function useGetInstitutionByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>(GetInstitutionByIdDocument, options);
        }
export function useGetInstitutionByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>(GetInstitutionByIdDocument, options);
        }
export type GetInstitutionByIdQueryHookResult = ReturnType<typeof useGetInstitutionByIdQuery>;
export type GetInstitutionByIdLazyQueryHookResult = ReturnType<typeof useGetInstitutionByIdLazyQuery>;
export type GetInstitutionByIdSuspenseQueryHookResult = ReturnType<typeof useGetInstitutionByIdSuspenseQuery>;
export type GetInstitutionByIdQueryResult = Apollo.QueryResult<GetInstitutionByIdQuery, GetInstitutionByIdQueryVariables>;
export const CreatePreAppraisalDocument = gql`
    mutation CreatePreAppraisal($input: CreatePreAppraisalInput!) {
  createPreAppraisal(input: $input) {
    id
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationDate
    candidateCount
    sampleCount
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    status
    generatedAt
    createdAt
  }
}
    `;
export type CreatePreAppraisalMutationFn = Apollo.MutationFunction<CreatePreAppraisalMutation, CreatePreAppraisalMutationVariables>;

/**
 * __useCreatePreAppraisalMutation__
 *
 * To run a mutation, you first call `useCreatePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPreAppraisalMutation, { data, loading, error }] = useCreatePreAppraisalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<CreatePreAppraisalMutation, CreatePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePreAppraisalMutation, CreatePreAppraisalMutationVariables>(CreatePreAppraisalDocument, options);
      }
export type CreatePreAppraisalMutationHookResult = ReturnType<typeof useCreatePreAppraisalMutation>;
export type CreatePreAppraisalMutationResult = Apollo.MutationResult<CreatePreAppraisalMutation>;
export type CreatePreAppraisalMutationOptions = Apollo.BaseMutationOptions<CreatePreAppraisalMutation, CreatePreAppraisalMutationVariables>;
export const UpdatePreAppraisalDocument = gql`
    mutation UpdatePreAppraisal($input: UpdatePreAppraisalInput!) {
  updatePreAppraisal(input: $input) {
    id
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationDate
    candidateCount
    sampleCount
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    status
    generatedAt
    createdAt
  }
}
    `;
export type UpdatePreAppraisalMutationFn = Apollo.MutationFunction<UpdatePreAppraisalMutation, UpdatePreAppraisalMutationVariables>;

/**
 * __useUpdatePreAppraisalMutation__
 *
 * To run a mutation, you first call `useUpdatePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePreAppraisalMutation, { data, loading, error }] = useUpdatePreAppraisalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePreAppraisalMutation, UpdatePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePreAppraisalMutation, UpdatePreAppraisalMutationVariables>(UpdatePreAppraisalDocument, options);
      }
export type UpdatePreAppraisalMutationHookResult = ReturnType<typeof useUpdatePreAppraisalMutation>;
export type UpdatePreAppraisalMutationResult = Apollo.MutationResult<UpdatePreAppraisalMutation>;
export type UpdatePreAppraisalMutationOptions = Apollo.BaseMutationOptions<UpdatePreAppraisalMutation, UpdatePreAppraisalMutationVariables>;
export const GeneratePreAppraisalDocument = gql`
    mutation GeneratePreAppraisal($id: ID!) {
  generatePreAppraisal(id: $id) {
    id
    status
    generatedAt
  }
}
    `;
export type GeneratePreAppraisalMutationFn = Apollo.MutationFunction<GeneratePreAppraisalMutation, GeneratePreAppraisalMutationVariables>;

/**
 * __useGeneratePreAppraisalMutation__
 *
 * To run a mutation, you first call `useGeneratePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGeneratePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generatePreAppraisalMutation, { data, loading, error }] = useGeneratePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGeneratePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<GeneratePreAppraisalMutation, GeneratePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GeneratePreAppraisalMutation, GeneratePreAppraisalMutationVariables>(GeneratePreAppraisalDocument, options);
      }
export type GeneratePreAppraisalMutationHookResult = ReturnType<typeof useGeneratePreAppraisalMutation>;
export type GeneratePreAppraisalMutationResult = Apollo.MutationResult<GeneratePreAppraisalMutation>;
export type GeneratePreAppraisalMutationOptions = Apollo.BaseMutationOptions<GeneratePreAppraisalMutation, GeneratePreAppraisalMutationVariables>;
export const CancelPreAppraisalDocument = gql`
    mutation CancelPreAppraisal($id: ID!) {
  cancelPreAppraisal(id: $id) {
    id
    status
  }
}
    `;
export type CancelPreAppraisalMutationFn = Apollo.MutationFunction<CancelPreAppraisalMutation, CancelPreAppraisalMutationVariables>;

/**
 * __useCancelPreAppraisalMutation__
 *
 * To run a mutation, you first call `useCancelPreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelPreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelPreAppraisalMutation, { data, loading, error }] = useCancelPreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelPreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<CancelPreAppraisalMutation, CancelPreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelPreAppraisalMutation, CancelPreAppraisalMutationVariables>(CancelPreAppraisalDocument, options);
      }
export type CancelPreAppraisalMutationHookResult = ReturnType<typeof useCancelPreAppraisalMutation>;
export type CancelPreAppraisalMutationResult = Apollo.MutationResult<CancelPreAppraisalMutation>;
export type CancelPreAppraisalMutationOptions = Apollo.BaseMutationOptions<CancelPreAppraisalMutation, CancelPreAppraisalMutationVariables>;
export const DeletePreAppraisalDocument = gql`
    mutation DeletePreAppraisal($id: ID!) {
  deletePreAppraisal(id: $id) {
    id
  }
}
    `;
export type DeletePreAppraisalMutationFn = Apollo.MutationFunction<DeletePreAppraisalMutation, DeletePreAppraisalMutationVariables>;

/**
 * __useDeletePreAppraisalMutation__
 *
 * To run a mutation, you first call `useDeletePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePreAppraisalMutation, { data, loading, error }] = useDeletePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DeletePreAppraisalMutation, DeletePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePreAppraisalMutation, DeletePreAppraisalMutationVariables>(DeletePreAppraisalDocument, options);
      }
export type DeletePreAppraisalMutationHookResult = ReturnType<typeof useDeletePreAppraisalMutation>;
export type DeletePreAppraisalMutationResult = Apollo.MutationResult<DeletePreAppraisalMutation>;
export type DeletePreAppraisalMutationOptions = Apollo.BaseMutationOptions<DeletePreAppraisalMutation, DeletePreAppraisalMutationVariables>;
export const RequestFormalPreAppraisalDocument = gql`
    mutation RequestFormalPreAppraisal($id: ID!) {
  requestFormalPreAppraisal(id: $id) {
    id
    status
  }
}
    `;
export type RequestFormalPreAppraisalMutationFn = Apollo.MutationFunction<RequestFormalPreAppraisalMutation, RequestFormalPreAppraisalMutationVariables>;

/**
 * __useRequestFormalPreAppraisalMutation__
 *
 * To run a mutation, you first call `useRequestFormalPreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFormalPreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFormalPreAppraisalMutation, { data, loading, error }] = useRequestFormalPreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRequestFormalPreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<RequestFormalPreAppraisalMutation, RequestFormalPreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestFormalPreAppraisalMutation, RequestFormalPreAppraisalMutationVariables>(RequestFormalPreAppraisalDocument, options);
      }
export type RequestFormalPreAppraisalMutationHookResult = ReturnType<typeof useRequestFormalPreAppraisalMutation>;
export type RequestFormalPreAppraisalMutationResult = Apollo.MutationResult<RequestFormalPreAppraisalMutation>;
export type RequestFormalPreAppraisalMutationOptions = Apollo.BaseMutationOptions<RequestFormalPreAppraisalMutation, RequestFormalPreAppraisalMutationVariables>;
export const DuplicatePreAppraisalDocument = gql`
    mutation DuplicatePreAppraisal($id: ID!) {
  duplicatePreAppraisal(id: $id) {
    id
    status
  }
}
    `;
export type DuplicatePreAppraisalMutationFn = Apollo.MutationFunction<DuplicatePreAppraisalMutation, DuplicatePreAppraisalMutationVariables>;

/**
 * __useDuplicatePreAppraisalMutation__
 *
 * To run a mutation, you first call `useDuplicatePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicatePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicatePreAppraisalMutation, { data, loading, error }] = useDuplicatePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDuplicatePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DuplicatePreAppraisalMutation, DuplicatePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicatePreAppraisalMutation, DuplicatePreAppraisalMutationVariables>(DuplicatePreAppraisalDocument, options);
      }
export type DuplicatePreAppraisalMutationHookResult = ReturnType<typeof useDuplicatePreAppraisalMutation>;
export type DuplicatePreAppraisalMutationResult = Apollo.MutationResult<DuplicatePreAppraisalMutation>;
export type DuplicatePreAppraisalMutationOptions = Apollo.BaseMutationOptions<DuplicatePreAppraisalMutation, DuplicatePreAppraisalMutationVariables>;
export const ListPreAppraisalsDocument = gql`
    query ListPreAppraisals($first: Int!, $page: Int, $filter: PreAppraisalFilterInput, $orderBy: [PreAppraisalOrderByInput!]) {
  preAppraisals(first: $first, page: $page, filter: $filter, orderBy: $orderBy) {
    data {
      id
      canEdit
      canDelete
      institutionId
      uuid
      reference
      name
      targetAddress
      targetLatitude
      targetLongitude
      radiusMeters
      sectorFilter
      valuationSelectionMode
      valuationDate
      candidateCount
      sampleCount
      minAverageSquareYard
      maxAverageSquareYard
      recommendedAverageSquareYard
      expectedRiskScore
      expectedRiskProfile
      annualAppreciationRate
      status
      generatedAt
      createdAt
      targetProperty {
        id
        name
        exactAddress
        cadastralKey
      }
      user {
        id
        name
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `;

/**
 * __useListPreAppraisalsQuery__
 *
 * To run a query within a React component, call `useListPreAppraisalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPreAppraisalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPreAppraisalsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      filter: // value for 'filter'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useListPreAppraisalsQuery(baseOptions: Apollo.QueryHookOptions<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables> & ({ variables: ListPreAppraisalsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>(ListPreAppraisalsDocument, options);
      }
export function useListPreAppraisalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>(ListPreAppraisalsDocument, options);
        }
export function useListPreAppraisalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>(ListPreAppraisalsDocument, options);
        }
export type ListPreAppraisalsQueryHookResult = ReturnType<typeof useListPreAppraisalsQuery>;
export type ListPreAppraisalsLazyQueryHookResult = ReturnType<typeof useListPreAppraisalsLazyQuery>;
export type ListPreAppraisalsSuspenseQueryHookResult = ReturnType<typeof useListPreAppraisalsSuspenseQuery>;
export type ListPreAppraisalsQueryResult = Apollo.QueryResult<ListPreAppraisalsQuery, ListPreAppraisalsQueryVariables>;
export const GetPreAppraisalByIdDocument = gql`
    query GetPreAppraisalById($id: ID!) {
  preAppraisalById(id: $id) {
    id
    canEdit
    canDelete
    institutionId
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationSelectionMode
    valuationDate
    timeFactor
    candidateCount
    sampleCount
    minAverageSquareYard
    maxAverageSquareYard
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    priceByYear
    riskByYear
    filters
    status
    generatedAt
    createdAt
    samples {
      tag
      propertyId
      propertyValuationId
      institutionId
      propertyName
      exactAddress
      cadastralKey
      latitude
      longitude
      valuationReference
      valuationSector
      averageSquareYard
      averageSquareMeter
      riskProfile
      riskScore
      measuredAt
      distanceMeters
      isWithinRadius
      valuationAgeYears
      timeWeight
      distanceWeight
      factor
      weightedPrice
      weightedRisk
    }
  }
}
    `;

/**
 * __useGetPreAppraisalByIdQuery__
 *
 * To run a query within a React component, call `useGetPreAppraisalByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPreAppraisalByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPreAppraisalByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPreAppraisalByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables> & ({ variables: GetPreAppraisalByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>(GetPreAppraisalByIdDocument, options);
      }
export function useGetPreAppraisalByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>(GetPreAppraisalByIdDocument, options);
        }
export function useGetPreAppraisalByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>(GetPreAppraisalByIdDocument, options);
        }
export type GetPreAppraisalByIdQueryHookResult = ReturnType<typeof useGetPreAppraisalByIdQuery>;
export type GetPreAppraisalByIdLazyQueryHookResult = ReturnType<typeof useGetPreAppraisalByIdLazyQuery>;
export type GetPreAppraisalByIdSuspenseQueryHookResult = ReturnType<typeof useGetPreAppraisalByIdSuspenseQuery>;
export type GetPreAppraisalByIdQueryResult = Apollo.QueryResult<GetPreAppraisalByIdQuery, GetPreAppraisalByIdQueryVariables>;
export const PreviewPreAppraisalDocument = gql`
    query PreviewPreAppraisal($input: PreAppraisalCalculationInput!) {
  previewPreAppraisal(input: $input) {
    targetPropertyId
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationDate
    timeFactor
    candidateCount
    sampleCount
    excludedWithoutValidValuationCount
    minAverageSquareYard
    maxAverageSquareYard
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    priceByYear
    riskByYear
    samples {
      tag
      propertyId
      propertyValuationId
      institutionId
      propertyName
      exactAddress
      cadastralKey
      latitude
      longitude
      valuationReference
      valuationSector
      averageSquareYard
      averageSquareMeter
      riskProfile
      riskScore
      measuredAt
      distanceMeters
      isWithinRadius
      valuationAgeYears
      timeWeight
      distanceWeight
      factor
      weightedPrice
      weightedRisk
    }
  }
}
    `;

/**
 * __usePreviewPreAppraisalQuery__
 *
 * To run a query within a React component, call `usePreviewPreAppraisalQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewPreAppraisalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewPreAppraisalQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePreviewPreAppraisalQuery(baseOptions: Apollo.QueryHookOptions<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables> & ({ variables: PreviewPreAppraisalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>(PreviewPreAppraisalDocument, options);
      }
export function usePreviewPreAppraisalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>(PreviewPreAppraisalDocument, options);
        }
export function usePreviewPreAppraisalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>(PreviewPreAppraisalDocument, options);
        }
export type PreviewPreAppraisalQueryHookResult = ReturnType<typeof usePreviewPreAppraisalQuery>;
export type PreviewPreAppraisalLazyQueryHookResult = ReturnType<typeof usePreviewPreAppraisalLazyQuery>;
export type PreviewPreAppraisalSuspenseQueryHookResult = ReturnType<typeof usePreviewPreAppraisalSuspenseQuery>;
export type PreviewPreAppraisalQueryResult = Apollo.QueryResult<PreviewPreAppraisalQuery, PreviewPreAppraisalQueryVariables>;
export const CreatePropertyDocument = gql`
    mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
    id
    name
  }
}
    `;
export type CreatePropertyMutationFn = Apollo.MutationFunction<CreatePropertyMutation, CreatePropertyMutationVariables>;

/**
 * __useCreatePropertyMutation__
 *
 * To run a mutation, you first call `useCreatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPropertyMutation, { data, loading, error }] = useCreatePropertyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePropertyMutation(baseOptions?: Apollo.MutationHookOptions<CreatePropertyMutation, CreatePropertyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePropertyMutation, CreatePropertyMutationVariables>(CreatePropertyDocument, options);
      }
export type CreatePropertyMutationHookResult = ReturnType<typeof useCreatePropertyMutation>;
export type CreatePropertyMutationResult = Apollo.MutationResult<CreatePropertyMutation>;
export type CreatePropertyMutationOptions = Apollo.BaseMutationOptions<CreatePropertyMutation, CreatePropertyMutationVariables>;
export const UpdatePropertyDocument = gql`
    mutation UpdateProperty($input: UpdatePropertyInput!) {
  updateProperty(input: $input) {
    id
    name
  }
}
    `;
export type UpdatePropertyMutationFn = Apollo.MutationFunction<UpdatePropertyMutation, UpdatePropertyMutationVariables>;

/**
 * __useUpdatePropertyMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyMutation, { data, loading, error }] = useUpdatePropertyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePropertyMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePropertyMutation, UpdatePropertyMutationVariables>(UpdatePropertyDocument, options);
      }
export type UpdatePropertyMutationHookResult = ReturnType<typeof useUpdatePropertyMutation>;
export type UpdatePropertyMutationResult = Apollo.MutationResult<UpdatePropertyMutation>;
export type UpdatePropertyMutationOptions = Apollo.BaseMutationOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>;
export const AddPropertyValuationDocument = gql`
    mutation AddPropertyValuation($propertyId: ID!, $input: AddValuationInput!) {
  addPropertyValuation(propertyId: $propertyId, input: $input) {
    id
  }
}
    `;
export type AddPropertyValuationMutationFn = Apollo.MutationFunction<AddPropertyValuationMutation, AddPropertyValuationMutationVariables>;

/**
 * __useAddPropertyValuationMutation__
 *
 * To run a mutation, you first call `useAddPropertyValuationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPropertyValuationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPropertyValuationMutation, { data, loading, error }] = useAddPropertyValuationMutation({
 *   variables: {
 *      propertyId: // value for 'propertyId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddPropertyValuationMutation(baseOptions?: Apollo.MutationHookOptions<AddPropertyValuationMutation, AddPropertyValuationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPropertyValuationMutation, AddPropertyValuationMutationVariables>(AddPropertyValuationDocument, options);
      }
export type AddPropertyValuationMutationHookResult = ReturnType<typeof useAddPropertyValuationMutation>;
export type AddPropertyValuationMutationResult = Apollo.MutationResult<AddPropertyValuationMutation>;
export type AddPropertyValuationMutationOptions = Apollo.BaseMutationOptions<AddPropertyValuationMutation, AddPropertyValuationMutationVariables>;
export const UpdatePropertyValuationDocument = gql`
    mutation UpdatePropertyValuation($input: UpdateValuationInput!) {
  updateValuation(input: $input) {
    id
  }
}
    `;
export type UpdatePropertyValuationMutationFn = Apollo.MutationFunction<UpdatePropertyValuationMutation, UpdatePropertyValuationMutationVariables>;

/**
 * __useUpdatePropertyValuationMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyValuationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyValuationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyValuationMutation, { data, loading, error }] = useUpdatePropertyValuationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePropertyValuationMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePropertyValuationMutation, UpdatePropertyValuationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePropertyValuationMutation, UpdatePropertyValuationMutationVariables>(UpdatePropertyValuationDocument, options);
      }
export type UpdatePropertyValuationMutationHookResult = ReturnType<typeof useUpdatePropertyValuationMutation>;
export type UpdatePropertyValuationMutationResult = Apollo.MutationResult<UpdatePropertyValuationMutation>;
export type UpdatePropertyValuationMutationOptions = Apollo.BaseMutationOptions<UpdatePropertyValuationMutation, UpdatePropertyValuationMutationVariables>;
export const DeletePropertyDocument = gql`
    mutation DeleteProperty($id: ID!) {
  deleteProperty(id: $id) {
    id
  }
}
    `;
export type DeletePropertyMutationFn = Apollo.MutationFunction<DeletePropertyMutation, DeletePropertyMutationVariables>;

/**
 * __useDeletePropertyMutation__
 *
 * To run a mutation, you first call `useDeletePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePropertyMutation, { data, loading, error }] = useDeletePropertyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePropertyMutation(baseOptions?: Apollo.MutationHookOptions<DeletePropertyMutation, DeletePropertyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePropertyMutation, DeletePropertyMutationVariables>(DeletePropertyDocument, options);
      }
export type DeletePropertyMutationHookResult = ReturnType<typeof useDeletePropertyMutation>;
export type DeletePropertyMutationResult = Apollo.MutationResult<DeletePropertyMutation>;
export type DeletePropertyMutationOptions = Apollo.BaseMutationOptions<DeletePropertyMutation, DeletePropertyMutationVariables>;
export const DeleteValuationDocument = gql`
    mutation DeleteValuation($id: ID!) {
  deleteValuation(id: $id) {
    id
  }
}
    `;
export type DeleteValuationMutationFn = Apollo.MutationFunction<DeleteValuationMutation, DeleteValuationMutationVariables>;

/**
 * __useDeleteValuationMutation__
 *
 * To run a mutation, you first call `useDeleteValuationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteValuationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteValuationMutation, { data, loading, error }] = useDeleteValuationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteValuationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteValuationMutation, DeleteValuationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteValuationMutation, DeleteValuationMutationVariables>(DeleteValuationDocument, options);
      }
export type DeleteValuationMutationHookResult = ReturnType<typeof useDeleteValuationMutation>;
export type DeleteValuationMutationResult = Apollo.MutationResult<DeleteValuationMutation>;
export type DeleteValuationMutationOptions = Apollo.BaseMutationOptions<DeleteValuationMutation, DeleteValuationMutationVariables>;
export const ListPropertiesDocument = gql`
    query ListProperties($first: Int!, $page: Int, $search: String, $valuationYear: Int) {
  properties(
    first: $first
    page: $page
    search: $search
    valuationYear: $valuationYear
  ) {
    data {
      id
      name
      exactAddress
      cadastralKey
      latitude
      longitude
      latestValuation {
        measuredAt
        institution {
          name
        }
      }
      quantity
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `;

/**
 * __useListPropertiesQuery__
 *
 * To run a query within a React component, call `useListPropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPropertiesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      valuationYear: // value for 'valuationYear'
 *   },
 * });
 */
export function useListPropertiesQuery(baseOptions: Apollo.QueryHookOptions<ListPropertiesQuery, ListPropertiesQueryVariables> & ({ variables: ListPropertiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPropertiesQuery, ListPropertiesQueryVariables>(ListPropertiesDocument, options);
      }
export function useListPropertiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPropertiesQuery, ListPropertiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPropertiesQuery, ListPropertiesQueryVariables>(ListPropertiesDocument, options);
        }
export function useListPropertiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPropertiesQuery, ListPropertiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPropertiesQuery, ListPropertiesQueryVariables>(ListPropertiesDocument, options);
        }
export type ListPropertiesQueryHookResult = ReturnType<typeof useListPropertiesQuery>;
export type ListPropertiesLazyQueryHookResult = ReturnType<typeof useListPropertiesLazyQuery>;
export type ListPropertiesSuspenseQueryHookResult = ReturnType<typeof useListPropertiesSuspenseQuery>;
export type ListPropertiesQueryResult = Apollo.QueryResult<ListPropertiesQuery, ListPropertiesQueryVariables>;
export const GetPropertyByIdDocument = gql`
    query GetPropertyById($id: ID!) {
  propertyById(id: $id) {
    valuationHistory {
      total
      financialCount
      controlCount
      otherCount
      valueChange
      valueChangePercent
      valuePoints {
        id
        date
        sector
        value
      }
      riskPoints {
        id
        date
        sector
        value
      }
    }
    canEdit
    canDelete
    id
    name
    exactAddress
    cadastralKey
    latitude
    longitude
    quantity
    latestValuation {
      id
    }
    valuations {
      canEdit
      canDelete
      id
      reference
      owner
      applicant
      phone
      sector
      averageValue
      measuredAt
      landArea
      improvementArea
      landValue
      utilizationRatio
      averageSquareYard
      averageSquareMeter
      riskProfile
      institution {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetPropertyByIdQuery__
 *
 * To run a query within a React component, call `useGetPropertyByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPropertyByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPropertyByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPropertyByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPropertyByIdQuery, GetPropertyByIdQueryVariables> & ({ variables: GetPropertyByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>(GetPropertyByIdDocument, options);
      }
export function useGetPropertyByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>(GetPropertyByIdDocument, options);
        }
export function useGetPropertyByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>(GetPropertyByIdDocument, options);
        }
export type GetPropertyByIdQueryHookResult = ReturnType<typeof useGetPropertyByIdQuery>;
export type GetPropertyByIdLazyQueryHookResult = ReturnType<typeof useGetPropertyByIdLazyQuery>;
export type GetPropertyByIdSuspenseQueryHookResult = ReturnType<typeof useGetPropertyByIdSuspenseQuery>;
export type GetPropertyByIdQueryResult = Apollo.QueryResult<GetPropertyByIdQuery, GetPropertyByIdQueryVariables>;
export const GetPropertiesWithinRadiusDocument = gql`
    query GetPropertiesWithinRadius($latitude: Float!, $longitude: Float!, $radiusMeters: Int!) {
  propertiesWithinRadius(
    latitude: $latitude
    longitude: $longitude
    radiusMeters: $radiusMeters
  ) {
    id
    name
    cadastralKey
    exactAddress
    latitude
    longitude
  }
}
    `;

/**
 * __useGetPropertiesWithinRadiusQuery__
 *
 * To run a query within a React component, call `useGetPropertiesWithinRadiusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPropertiesWithinRadiusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPropertiesWithinRadiusQuery({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      radiusMeters: // value for 'radiusMeters'
 *   },
 * });
 */
export function useGetPropertiesWithinRadiusQuery(baseOptions: Apollo.QueryHookOptions<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables> & ({ variables: GetPropertiesWithinRadiusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>(GetPropertiesWithinRadiusDocument, options);
      }
export function useGetPropertiesWithinRadiusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>(GetPropertiesWithinRadiusDocument, options);
        }
export function useGetPropertiesWithinRadiusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>(GetPropertiesWithinRadiusDocument, options);
        }
export type GetPropertiesWithinRadiusQueryHookResult = ReturnType<typeof useGetPropertiesWithinRadiusQuery>;
export type GetPropertiesWithinRadiusLazyQueryHookResult = ReturnType<typeof useGetPropertiesWithinRadiusLazyQuery>;
export type GetPropertiesWithinRadiusSuspenseQueryHookResult = ReturnType<typeof useGetPropertiesWithinRadiusSuspenseQuery>;
export type GetPropertiesWithinRadiusQueryResult = Apollo.QueryResult<GetPropertiesWithinRadiusQuery, GetPropertiesWithinRadiusQueryVariables>;
export const PropertyValuationYearsDocument = gql`
    query PropertyValuationYears {
  propertyValuationYears
}
    `;

/**
 * __usePropertyValuationYearsQuery__
 *
 * To run a query within a React component, call `usePropertyValuationYearsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertyValuationYearsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertyValuationYearsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePropertyValuationYearsQuery(baseOptions?: Apollo.QueryHookOptions<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>(PropertyValuationYearsDocument, options);
      }
export function usePropertyValuationYearsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>(PropertyValuationYearsDocument, options);
        }
export function usePropertyValuationYearsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>(PropertyValuationYearsDocument, options);
        }
export type PropertyValuationYearsQueryHookResult = ReturnType<typeof usePropertyValuationYearsQuery>;
export type PropertyValuationYearsLazyQueryHookResult = ReturnType<typeof usePropertyValuationYearsLazyQuery>;
export type PropertyValuationYearsSuspenseQueryHookResult = ReturnType<typeof usePropertyValuationYearsSuspenseQuery>;
export type PropertyValuationYearsQueryResult = Apollo.QueryResult<PropertyValuationYearsQuery, PropertyValuationYearsQueryVariables>;
export const PropertyMapSummaryDocument = gql`
    query PropertyMapSummary($id: ID!) {
  propertyMapDetails(id: $id) {
    id
    externalValuationSummary {
      count
      hasNewer
    }
  }
}
    `;

/**
 * __usePropertyMapSummaryQuery__
 *
 * To run a query within a React component, call `usePropertyMapSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertyMapSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertyMapSummaryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePropertyMapSummaryQuery(baseOptions: Apollo.QueryHookOptions<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables> & ({ variables: PropertyMapSummaryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>(PropertyMapSummaryDocument, options);
      }
export function usePropertyMapSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>(PropertyMapSummaryDocument, options);
        }
export function usePropertyMapSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>(PropertyMapSummaryDocument, options);
        }
export type PropertyMapSummaryQueryHookResult = ReturnType<typeof usePropertyMapSummaryQuery>;
export type PropertyMapSummaryLazyQueryHookResult = ReturnType<typeof usePropertyMapSummaryLazyQuery>;
export type PropertyMapSummarySuspenseQueryHookResult = ReturnType<typeof usePropertyMapSummarySuspenseQuery>;
export type PropertyMapSummaryQueryResult = Apollo.QueryResult<PropertyMapSummaryQuery, PropertyMapSummaryQueryVariables>;
export const PropertyExternalValuationsDocument = gql`
    query PropertyExternalValuations($id: ID!, $page: Int!) {
  propertyMapDetails(id: $id) {
    id
    externalValuations(first: 10, page: $page) {
      currentPage
      hasMorePages
      data {
        id
        institutionName
        measuredAt
        sector
        averageValue
        averageSquareYard
        landArea
        riskProfile
        isNewer
      }
    }
  }
}
    `;

/**
 * __usePropertyExternalValuationsQuery__
 *
 * To run a query within a React component, call `usePropertyExternalValuationsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertyExternalValuationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertyExternalValuationsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      page: // value for 'page'
 *   },
 * });
 */
export function usePropertyExternalValuationsQuery(baseOptions: Apollo.QueryHookOptions<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables> & ({ variables: PropertyExternalValuationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>(PropertyExternalValuationsDocument, options);
      }
export function usePropertyExternalValuationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>(PropertyExternalValuationsDocument, options);
        }
export function usePropertyExternalValuationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>(PropertyExternalValuationsDocument, options);
        }
export type PropertyExternalValuationsQueryHookResult = ReturnType<typeof usePropertyExternalValuationsQuery>;
export type PropertyExternalValuationsLazyQueryHookResult = ReturnType<typeof usePropertyExternalValuationsLazyQuery>;
export type PropertyExternalValuationsSuspenseQueryHookResult = ReturnType<typeof usePropertyExternalValuationsSuspenseQuery>;
export type PropertyExternalValuationsQueryResult = Apollo.QueryResult<PropertyExternalValuationsQuery, PropertyExternalValuationsQueryVariables>;
export const ValuationInstitutionOptionsDocument = gql`
    query ValuationInstitutionOptions {
  hasGlobalInstitutionScope
  valuationInstitutions {
    id
    name
  }
}
    `;

/**
 * __useValuationInstitutionOptionsQuery__
 *
 * To run a query within a React component, call `useValuationInstitutionOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useValuationInstitutionOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValuationInstitutionOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useValuationInstitutionOptionsQuery(baseOptions?: Apollo.QueryHookOptions<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>(ValuationInstitutionOptionsDocument, options);
      }
export function useValuationInstitutionOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>(ValuationInstitutionOptionsDocument, options);
        }
export function useValuationInstitutionOptionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>(ValuationInstitutionOptionsDocument, options);
        }
export type ValuationInstitutionOptionsQueryHookResult = ReturnType<typeof useValuationInstitutionOptionsQuery>;
export type ValuationInstitutionOptionsLazyQueryHookResult = ReturnType<typeof useValuationInstitutionOptionsLazyQuery>;
export type ValuationInstitutionOptionsSuspenseQueryHookResult = ReturnType<typeof useValuationInstitutionOptionsSuspenseQuery>;
export type ValuationInstitutionOptionsQueryResult = Apollo.QueryResult<ValuationInstitutionOptionsQuery, ValuationInstitutionOptionsQueryVariables>;
export const PropertiesWithinBoundsDocument = gql`
    query PropertiesWithinBounds($northLatitude: Float!, $eastLongitude: Float!, $southLatitude: Float!, $westLongitude: Float!, $limit: Int) {
  propertiesWithinBounds(
    northLatitude: $northLatitude
    eastLongitude: $eastLongitude
    southLatitude: $southLatitude
    westLongitude: $westLongitude
    limit: $limit
  ) {
    ...PropertyPointFields
  }
}
    ${PropertyPointFieldsFragmentDoc}`;

/**
 * __usePropertiesWithinBoundsQuery__
 *
 * To run a query within a React component, call `usePropertiesWithinBoundsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertiesWithinBoundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertiesWithinBoundsQuery({
 *   variables: {
 *      northLatitude: // value for 'northLatitude'
 *      eastLongitude: // value for 'eastLongitude'
 *      southLatitude: // value for 'southLatitude'
 *      westLongitude: // value for 'westLongitude'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function usePropertiesWithinBoundsQuery(baseOptions: Apollo.QueryHookOptions<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables> & ({ variables: PropertiesWithinBoundsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>(PropertiesWithinBoundsDocument, options);
      }
export function usePropertiesWithinBoundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>(PropertiesWithinBoundsDocument, options);
        }
export function usePropertiesWithinBoundsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>(PropertiesWithinBoundsDocument, options);
        }
export type PropertiesWithinBoundsQueryHookResult = ReturnType<typeof usePropertiesWithinBoundsQuery>;
export type PropertiesWithinBoundsLazyQueryHookResult = ReturnType<typeof usePropertiesWithinBoundsLazyQuery>;
export type PropertiesWithinBoundsSuspenseQueryHookResult = ReturnType<typeof usePropertiesWithinBoundsSuspenseQuery>;
export type PropertiesWithinBoundsQueryResult = Apollo.QueryResult<PropertiesWithinBoundsQuery, PropertiesWithinBoundsQueryVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    name
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    id
    name
    permisos
  }
}
    `;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($id: ID!) {
  deleteRole(id: $id) {
    id
  }
}
    `;
export type DeleteRoleMutationFn = Apollo.MutationFunction<DeleteRoleMutation, DeleteRoleMutationVariables>;

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoleMutation, { data, loading, error }] = useDeleteRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, options);
      }
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>;
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>;
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const ListRolesDocument = gql`
    query ListRoles($first: Int!, $page: Int, $search: String) {
  roles(first: $first, page: $page, search: $search) {
    data {
      id
      name
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `;

/**
 * __useListRolesQuery__
 *
 * To run a query within a React component, call `useListRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRolesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListRolesQuery(baseOptions: Apollo.QueryHookOptions<ListRolesQuery, ListRolesQueryVariables> & ({ variables: ListRolesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListRolesQuery, ListRolesQueryVariables>(ListRolesDocument, options);
      }
export function useListRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListRolesQuery, ListRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListRolesQuery, ListRolesQueryVariables>(ListRolesDocument, options);
        }
export function useListRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListRolesQuery, ListRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListRolesQuery, ListRolesQueryVariables>(ListRolesDocument, options);
        }
export type ListRolesQueryHookResult = ReturnType<typeof useListRolesQuery>;
export type ListRolesLazyQueryHookResult = ReturnType<typeof useListRolesLazyQuery>;
export type ListRolesSuspenseQueryHookResult = ReturnType<typeof useListRolesSuspenseQuery>;
export type ListRolesQueryResult = Apollo.QueryResult<ListRolesQuery, ListRolesQueryVariables>;
export const GetRoleByIdDocument = gql`
    query GetRoleById($id: ID!) {
  roleById(id: $id) {
    id
    name
    permisos
  }
}
    `;

/**
 * __useGetRoleByIdQuery__
 *
 * To run a query within a React component, call `useGetRoleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRoleByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables> & ({ variables: GetRoleByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
      }
export function useGetRoleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
        }
export function useGetRoleByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
        }
export type GetRoleByIdQueryHookResult = ReturnType<typeof useGetRoleByIdQuery>;
export type GetRoleByIdLazyQueryHookResult = ReturnType<typeof useGetRoleByIdLazyQuery>;
export type GetRoleByIdSuspenseQueryHookResult = ReturnType<typeof useGetRoleByIdSuspenseQuery>;
export type GetRoleByIdQueryResult = Apollo.QueryResult<GetRoleByIdQuery, GetRoleByIdQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    institutions {
      id
      name
    }
    id
    name
    email
    roles {
      id
      name
    }
    permisos
    permisosExtra
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ListUsersDocument = gql`
    query ListUsers($first: Int!, $page: Int, $search: String) {
  users(first: $first, page: $page, search: $search) {
    data {
      id
      name
      roles {
        id
        name
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListUsersQuery(baseOptions: Apollo.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables> & ({ variables: ListUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
      }
export function useListUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export function useListUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, options);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersSuspenseQueryHookResult = ReturnType<typeof useListUsersSuspenseQuery>;
export type ListUsersQueryResult = Apollo.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
export const GetUserByIdDocument = gql`
    query GetUserById($id: ID!) {
  userById(id: $id) {
    institutions {
      id
      name
    }
    id
    name
    email
    roles {
      id
      name
    }
    permisos
    permisosExtra
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables> & ({ variables: GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const PreAppraisalInstitutionOptionsDocument = gql`
    query PreAppraisalInstitutionOptions {
  preAppraisalInstitutionOptions {
    canSelectNone
    institutions {
      id
      name
    }
  }
}
    `;

/**
 * __usePreAppraisalInstitutionOptionsQuery__
 *
 * To run a query within a React component, call `usePreAppraisalInstitutionOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreAppraisalInstitutionOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreAppraisalInstitutionOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePreAppraisalInstitutionOptionsQuery(baseOptions?: Apollo.QueryHookOptions<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>(PreAppraisalInstitutionOptionsDocument, options);
      }
export function usePreAppraisalInstitutionOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>(PreAppraisalInstitutionOptionsDocument, options);
        }
export function usePreAppraisalInstitutionOptionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>(PreAppraisalInstitutionOptionsDocument, options);
        }
export type PreAppraisalInstitutionOptionsQueryHookResult = ReturnType<typeof usePreAppraisalInstitutionOptionsQuery>;
export type PreAppraisalInstitutionOptionsLazyQueryHookResult = ReturnType<typeof usePreAppraisalInstitutionOptionsLazyQuery>;
export type PreAppraisalInstitutionOptionsSuspenseQueryHookResult = ReturnType<typeof usePreAppraisalInstitutionOptionsSuspenseQuery>;
export type PreAppraisalInstitutionOptionsQueryResult = Apollo.QueryResult<PreAppraisalInstitutionOptionsQuery, PreAppraisalInstitutionOptionsQueryVariables>;
export const PreAppraisalSampleLinksDocument = gql`
    query PreAppraisalSampleLinks($valuationIds: [ID!]!) {
  preAppraisalSampleLinks(valuationIds: $valuationIds) {
    valuationId
    propertyId
  }
}
    `;

/**
 * __usePreAppraisalSampleLinksQuery__
 *
 * To run a query within a React component, call `usePreAppraisalSampleLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreAppraisalSampleLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreAppraisalSampleLinksQuery({
 *   variables: {
 *      valuationIds: // value for 'valuationIds'
 *   },
 * });
 */
export function usePreAppraisalSampleLinksQuery(baseOptions: Apollo.QueryHookOptions<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables> & ({ variables: PreAppraisalSampleLinksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>(PreAppraisalSampleLinksDocument, options);
      }
export function usePreAppraisalSampleLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>(PreAppraisalSampleLinksDocument, options);
        }
export function usePreAppraisalSampleLinksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>(PreAppraisalSampleLinksDocument, options);
        }
export type PreAppraisalSampleLinksQueryHookResult = ReturnType<typeof usePreAppraisalSampleLinksQuery>;
export type PreAppraisalSampleLinksLazyQueryHookResult = ReturnType<typeof usePreAppraisalSampleLinksLazyQuery>;
export type PreAppraisalSampleLinksSuspenseQueryHookResult = ReturnType<typeof usePreAppraisalSampleLinksSuspenseQuery>;
export type PreAppraisalSampleLinksQueryResult = Apollo.QueryResult<PreAppraisalSampleLinksQuery, PreAppraisalSampleLinksQueryVariables>;
export const GetPreAppraisalDetailDocument = gql`
    query GetPreAppraisalDetail($id: ID!) {
  preAppraisalById(id: $id) {
    id
    institutionId
    institution {
      id
      name
    }
    canEdit
    canDelete
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationDate
    timeFactor
    candidateCount
    sampleCount
    minAverageSquareYard
    maxAverageSquareYard
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    priceByYear
    riskByYear
    filters
    status
    generatedAt
    createdAt
    samples {
      tag
      propertyId
      propertyValuationId
      institutionId
      propertyName
      exactAddress
      cadastralKey
      latitude
      longitude
      valuationReference
      valuationSector
      averageSquareYard
      averageSquareMeter
      riskProfile
      riskScore
      measuredAt
      distanceMeters
      isWithinRadius
      valuationAgeYears
      timeWeight
      distanceWeight
      factor
      weightedPrice
      weightedRisk
    }
  }
}
    `;

/**
 * __useGetPreAppraisalDetailQuery__
 *
 * To run a query within a React component, call `useGetPreAppraisalDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPreAppraisalDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPreAppraisalDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPreAppraisalDetailQuery(baseOptions: Apollo.QueryHookOptions<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables> & ({ variables: GetPreAppraisalDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>(GetPreAppraisalDetailDocument, options);
      }
export function useGetPreAppraisalDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>(GetPreAppraisalDetailDocument, options);
        }
export function useGetPreAppraisalDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>(GetPreAppraisalDetailDocument, options);
        }
export type GetPreAppraisalDetailQueryHookResult = ReturnType<typeof useGetPreAppraisalDetailQuery>;
export type GetPreAppraisalDetailLazyQueryHookResult = ReturnType<typeof useGetPreAppraisalDetailLazyQuery>;
export type GetPreAppraisalDetailSuspenseQueryHookResult = ReturnType<typeof useGetPreAppraisalDetailSuspenseQuery>;
export type GetPreAppraisalDetailQueryResult = Apollo.QueryResult<GetPreAppraisalDetailQuery, GetPreAppraisalDetailQueryVariables>;
export const DetailGeneratePreAppraisalDocument = gql`
    mutation DetailGeneratePreAppraisal($id: ID!) {
  generatePreAppraisal(id: $id) {
    id
    status
    generatedAt
  }
}
    `;
export type DetailGeneratePreAppraisalMutationFn = Apollo.MutationFunction<DetailGeneratePreAppraisalMutation, DetailGeneratePreAppraisalMutationVariables>;

/**
 * __useDetailGeneratePreAppraisalMutation__
 *
 * To run a mutation, you first call `useDetailGeneratePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailGeneratePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailGeneratePreAppraisalMutation, { data, loading, error }] = useDetailGeneratePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailGeneratePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DetailGeneratePreAppraisalMutation, DetailGeneratePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailGeneratePreAppraisalMutation, DetailGeneratePreAppraisalMutationVariables>(DetailGeneratePreAppraisalDocument, options);
      }
export type DetailGeneratePreAppraisalMutationHookResult = ReturnType<typeof useDetailGeneratePreAppraisalMutation>;
export type DetailGeneratePreAppraisalMutationResult = Apollo.MutationResult<DetailGeneratePreAppraisalMutation>;
export type DetailGeneratePreAppraisalMutationOptions = Apollo.BaseMutationOptions<DetailGeneratePreAppraisalMutation, DetailGeneratePreAppraisalMutationVariables>;
export const DetailCancelPreAppraisalDocument = gql`
    mutation DetailCancelPreAppraisal($id: ID!) {
  cancelPreAppraisal(id: $id) {
    id
    status
  }
}
    `;
export type DetailCancelPreAppraisalMutationFn = Apollo.MutationFunction<DetailCancelPreAppraisalMutation, DetailCancelPreAppraisalMutationVariables>;

/**
 * __useDetailCancelPreAppraisalMutation__
 *
 * To run a mutation, you first call `useDetailCancelPreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailCancelPreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailCancelPreAppraisalMutation, { data, loading, error }] = useDetailCancelPreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailCancelPreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DetailCancelPreAppraisalMutation, DetailCancelPreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailCancelPreAppraisalMutation, DetailCancelPreAppraisalMutationVariables>(DetailCancelPreAppraisalDocument, options);
      }
export type DetailCancelPreAppraisalMutationHookResult = ReturnType<typeof useDetailCancelPreAppraisalMutation>;
export type DetailCancelPreAppraisalMutationResult = Apollo.MutationResult<DetailCancelPreAppraisalMutation>;
export type DetailCancelPreAppraisalMutationOptions = Apollo.BaseMutationOptions<DetailCancelPreAppraisalMutation, DetailCancelPreAppraisalMutationVariables>;
export const DetailDeletePreAppraisalDocument = gql`
    mutation DetailDeletePreAppraisal($id: ID!) {
  deletePreAppraisal(id: $id) {
    id
  }
}
    `;
export type DetailDeletePreAppraisalMutationFn = Apollo.MutationFunction<DetailDeletePreAppraisalMutation, DetailDeletePreAppraisalMutationVariables>;

/**
 * __useDetailDeletePreAppraisalMutation__
 *
 * To run a mutation, you first call `useDetailDeletePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailDeletePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailDeletePreAppraisalMutation, { data, loading, error }] = useDetailDeletePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailDeletePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DetailDeletePreAppraisalMutation, DetailDeletePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailDeletePreAppraisalMutation, DetailDeletePreAppraisalMutationVariables>(DetailDeletePreAppraisalDocument, options);
      }
export type DetailDeletePreAppraisalMutationHookResult = ReturnType<typeof useDetailDeletePreAppraisalMutation>;
export type DetailDeletePreAppraisalMutationResult = Apollo.MutationResult<DetailDeletePreAppraisalMutation>;
export type DetailDeletePreAppraisalMutationOptions = Apollo.BaseMutationOptions<DetailDeletePreAppraisalMutation, DetailDeletePreAppraisalMutationVariables>;
export const DetailRequestFormalPreAppraisalDocument = gql`
    mutation DetailRequestFormalPreAppraisal($id: ID!) {
  requestFormalPreAppraisal(id: $id) {
    id
    status
  }
}
    `;
export type DetailRequestFormalPreAppraisalMutationFn = Apollo.MutationFunction<DetailRequestFormalPreAppraisalMutation, DetailRequestFormalPreAppraisalMutationVariables>;

/**
 * __useDetailRequestFormalPreAppraisalMutation__
 *
 * To run a mutation, you first call `useDetailRequestFormalPreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailRequestFormalPreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailRequestFormalPreAppraisalMutation, { data, loading, error }] = useDetailRequestFormalPreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailRequestFormalPreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DetailRequestFormalPreAppraisalMutation, DetailRequestFormalPreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailRequestFormalPreAppraisalMutation, DetailRequestFormalPreAppraisalMutationVariables>(DetailRequestFormalPreAppraisalDocument, options);
      }
export type DetailRequestFormalPreAppraisalMutationHookResult = ReturnType<typeof useDetailRequestFormalPreAppraisalMutation>;
export type DetailRequestFormalPreAppraisalMutationResult = Apollo.MutationResult<DetailRequestFormalPreAppraisalMutation>;
export type DetailRequestFormalPreAppraisalMutationOptions = Apollo.BaseMutationOptions<DetailRequestFormalPreAppraisalMutation, DetailRequestFormalPreAppraisalMutationVariables>;
export const DetailDuplicatePreAppraisalDocument = gql`
    mutation DetailDuplicatePreAppraisal($id: ID!, $institutionId: ID) {
  duplicatePreAppraisal(id: $id, institutionId: $institutionId) {
    id
    status
  }
}
    `;
export type DetailDuplicatePreAppraisalMutationFn = Apollo.MutationFunction<DetailDuplicatePreAppraisalMutation, DetailDuplicatePreAppraisalMutationVariables>;

/**
 * __useDetailDuplicatePreAppraisalMutation__
 *
 * To run a mutation, you first call `useDetailDuplicatePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailDuplicatePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailDuplicatePreAppraisalMutation, { data, loading, error }] = useDetailDuplicatePreAppraisalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      institutionId: // value for 'institutionId'
 *   },
 * });
 */
export function useDetailDuplicatePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<DetailDuplicatePreAppraisalMutation, DetailDuplicatePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailDuplicatePreAppraisalMutation, DetailDuplicatePreAppraisalMutationVariables>(DetailDuplicatePreAppraisalDocument, options);
      }
export type DetailDuplicatePreAppraisalMutationHookResult = ReturnType<typeof useDetailDuplicatePreAppraisalMutation>;
export type DetailDuplicatePreAppraisalMutationResult = Apollo.MutationResult<DetailDuplicatePreAppraisalMutation>;
export type DetailDuplicatePreAppraisalMutationOptions = Apollo.BaseMutationOptions<DetailDuplicatePreAppraisalMutation, DetailDuplicatePreAppraisalMutationVariables>;
export const DetailDownloadPreAppraisalPdfDocument = gql`
    mutation DetailDownloadPreAppraisalPdf($id: ID!) {
  downloadPreAppraisalPdf(id: $id) {
    filename
    mimeType
    contentBase64
  }
}
    `;
export type DetailDownloadPreAppraisalPdfMutationFn = Apollo.MutationFunction<DetailDownloadPreAppraisalPdfMutation, DetailDownloadPreAppraisalPdfMutationVariables>;

/**
 * __useDetailDownloadPreAppraisalPdfMutation__
 *
 * To run a mutation, you first call `useDetailDownloadPreAppraisalPdfMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDetailDownloadPreAppraisalPdfMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [detailDownloadPreAppraisalPdfMutation, { data, loading, error }] = useDetailDownloadPreAppraisalPdfMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDetailDownloadPreAppraisalPdfMutation(baseOptions?: Apollo.MutationHookOptions<DetailDownloadPreAppraisalPdfMutation, DetailDownloadPreAppraisalPdfMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DetailDownloadPreAppraisalPdfMutation, DetailDownloadPreAppraisalPdfMutationVariables>(DetailDownloadPreAppraisalPdfDocument, options);
      }
export type DetailDownloadPreAppraisalPdfMutationHookResult = ReturnType<typeof useDetailDownloadPreAppraisalPdfMutation>;
export type DetailDownloadPreAppraisalPdfMutationResult = Apollo.MutationResult<DetailDownloadPreAppraisalPdfMutation>;
export type DetailDownloadPreAppraisalPdfMutationOptions = Apollo.BaseMutationOptions<DetailDownloadPreAppraisalPdfMutation, DetailDownloadPreAppraisalPdfMutationVariables>;
export const EditGetPreAppraisalByIdDocument = gql`
    query EditGetPreAppraisalById($id: ID!) {
  preAppraisalById(id: $id) {
    id
    institutionId
    canEdit
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationSelectionMode
    valuationDate
    timeFactor
    candidateCount
    sampleCount
    minAverageSquareYard
    maxAverageSquareYard
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    priceByYear
    riskByYear
    filters
    status
    generatedAt
    createdAt
    samples {
      tag
      propertyId
      propertyValuationId
      institutionId
      propertyName
      exactAddress
      cadastralKey
      latitude
      longitude
      valuationReference
      valuationSector
      averageSquareYard
      averageSquareMeter
      riskProfile
      riskScore
      measuredAt
      distanceMeters
      isWithinRadius
      valuationAgeYears
      timeWeight
      distanceWeight
      factor
      weightedPrice
      weightedRisk
    }
  }
}
    `;

/**
 * __useEditGetPreAppraisalByIdQuery__
 *
 * To run a query within a React component, call `useEditGetPreAppraisalByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEditGetPreAppraisalByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEditGetPreAppraisalByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditGetPreAppraisalByIdQuery(baseOptions: Apollo.QueryHookOptions<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables> & ({ variables: EditGetPreAppraisalByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>(EditGetPreAppraisalByIdDocument, options);
      }
export function useEditGetPreAppraisalByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>(EditGetPreAppraisalByIdDocument, options);
        }
export function useEditGetPreAppraisalByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>(EditGetPreAppraisalByIdDocument, options);
        }
export type EditGetPreAppraisalByIdQueryHookResult = ReturnType<typeof useEditGetPreAppraisalByIdQuery>;
export type EditGetPreAppraisalByIdLazyQueryHookResult = ReturnType<typeof useEditGetPreAppraisalByIdLazyQuery>;
export type EditGetPreAppraisalByIdSuspenseQueryHookResult = ReturnType<typeof useEditGetPreAppraisalByIdSuspenseQuery>;
export type EditGetPreAppraisalByIdQueryResult = Apollo.QueryResult<EditGetPreAppraisalByIdQuery, EditGetPreAppraisalByIdQueryVariables>;
export const EditUpdatePreAppraisalDocument = gql`
    mutation EditUpdatePreAppraisal($input: UpdatePreAppraisalInput!) {
  updatePreAppraisal(input: $input) {
    id
    uuid
    reference
    name
    targetAddress
    targetLatitude
    targetLongitude
    radiusMeters
    sectorFilter
    valuationDate
    candidateCount
    sampleCount
    recommendedAverageSquareYard
    expectedRiskScore
    expectedRiskProfile
    annualAppreciationRate
    status
    generatedAt
    createdAt
  }
}
    `;
export type EditUpdatePreAppraisalMutationFn = Apollo.MutationFunction<EditUpdatePreAppraisalMutation, EditUpdatePreAppraisalMutationVariables>;

/**
 * __useEditUpdatePreAppraisalMutation__
 *
 * To run a mutation, you first call `useEditUpdatePreAppraisalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUpdatePreAppraisalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUpdatePreAppraisalMutation, { data, loading, error }] = useEditUpdatePreAppraisalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUpdatePreAppraisalMutation(baseOptions?: Apollo.MutationHookOptions<EditUpdatePreAppraisalMutation, EditUpdatePreAppraisalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUpdatePreAppraisalMutation, EditUpdatePreAppraisalMutationVariables>(EditUpdatePreAppraisalDocument, options);
      }
export type EditUpdatePreAppraisalMutationHookResult = ReturnType<typeof useEditUpdatePreAppraisalMutation>;
export type EditUpdatePreAppraisalMutationResult = Apollo.MutationResult<EditUpdatePreAppraisalMutation>;
export type EditUpdatePreAppraisalMutationOptions = Apollo.BaseMutationOptions<EditUpdatePreAppraisalMutation, EditUpdatePreAppraisalMutationVariables>;