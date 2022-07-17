// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import { QueryPart } from "@compas/store";
import { ParameterizedContext as Context } from "koa";
import { InsightEvent, Logger } from "@compas/stdlib";
import { Next } from "@compas/server";
import { Middleware } from "@compas/server";
declare global {
  type AuthLogoutResponse = { success: true };
  type AuthMeResponse = { session: AuthSession };
  type AuthSession = { id: string; createdAt: Date };
  type AuthRefreshTokensBody = { refreshToken: string };
  type AuthTokenPair = { accessToken: string; refreshToken: string };
  type CompasStructureResponse = any;
  // Postgres based file storage.
  type StoreFile = {
    bucketName: string;
    contentLength: number;
    contentType: string;
    name: string;
    meta: StoreFileMeta;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  // User definable, optional object to store whatever you want
  type StoreFileMeta = {
    transforms?: undefined | any;
    transformedFromOriginal?: undefined | string;
    placeholderImage?: undefined | string;
    altText?: undefined | string;
  };
  type StoreFileResponse = {
    id: string;
    name: string;
    contentType: string;
    url: string;
    placeholderImage?: undefined | string;
    altText?: undefined | string;
  };
  // Set as '.query(T.reference("store", "imageTransformOptions"))' of routes that use 'sendTransformedImage'.
  type StoreImageTransformOptions = { q: number; w: number };
  // Postgres based job queue.
  // Use {@link queueWorkerAddJob} to insert new jobs in to the queue and {@link queueWorkerRegisterCronJobs} for all your recurring jobs.
  // Use {@link queueWorkerCreate} as a way to pick up jobs.
  type StoreJob = {
    id: number;
    isComplete: boolean;
    priority: number;
    scheduledAt: Date;
    name: string;
    data: any;
    retryCount: number;
    handlerTimeout?: undefined | number;
    createdAt: Date;
    updatedAt: Date;
  };
  // Set as '.query(T.reference("store", "secureImageTransformOptions"))' of routes that use 'sendTransformedImage' and 'fileVerifyAccessToken'.
  type StoreSecureImageTransformOptions = {
    accessToken: string;
    q: number;
    w: number;
  };
  // Session data store, used by 'sessionStore\*' functions.
  type StoreSessionStore = {
    data: any;
    checksum: string;
    revokedAt?: undefined | Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  // Store all tokens that belong to a session.
  type StoreSessionStoreToken = {
    expiresAt: Date;
    revokedAt?: undefined | Date;
    createdAt: Date;
    id: string;
    session: string;
    refreshToken?: undefined | string;
  };
  type StoreFileWhere = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreFileWhere[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    bucketName?: undefined | string;
    bucketNameNotEqual?: undefined | string;
    bucketNameIn?: undefined | string[] | QueryPart<any>;
    bucketNameNotIn?: undefined | string[] | QueryPart<any>;
    bucketNameLike?: undefined | string;
    bucketNameILike?: undefined | string;
    bucketNameNotLike?: undefined | string;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
  };
  type StoreJobWhere = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreJobWhere[];
    id?: undefined | number;
    idNotEqual?: undefined | number;
    idIn?: undefined | number[] | QueryPart<any>;
    idNotIn?: undefined | number[] | QueryPart<any>;
    idGreaterThan?: undefined | number;
    idLowerThan?: undefined | number;
    isComplete?: undefined | boolean;
    isCompleteIsNull?: undefined | boolean;
    isCompleteIsNotNull?: undefined | boolean;
    name?: undefined | string;
    nameNotEqual?: undefined | string;
    nameIn?: undefined | string[] | QueryPart<any>;
    nameNotIn?: undefined | string[] | QueryPart<any>;
    nameLike?: undefined | string;
    nameILike?: undefined | string;
    nameNotLike?: undefined | string;
    scheduledAt?: undefined | Date;
    scheduledAtNotEqual?: undefined | Date;
    scheduledAtIn?: undefined | Date[] | QueryPart<any>;
    scheduledAtNotIn?: undefined | Date[] | QueryPart<any>;
    scheduledAtGreaterThan?: undefined | Date;
    scheduledAtLowerThan?: undefined | Date;
    scheduledAtIsNull?: undefined | boolean;
    scheduledAtIsNotNull?: undefined | boolean;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
  };
  type StoreSessionStoreWhere = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreSessionStoreWhere[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
    viaAccessTokens?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhere;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    accessTokensNotExists?: undefined | StoreSessionStoreTokenWhere;
  };
  type StoreSessionStoreTokenWhere = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreSessionStoreTokenWhere[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    session?: undefined | string;
    sessionNotEqual?: undefined | string;
    sessionIn?: undefined | string[] | QueryPart<any>;
    sessionNotIn?: undefined | string[] | QueryPart<any>;
    expiresAt?: undefined | Date;
    expiresAtNotEqual?: undefined | Date;
    expiresAtIn?: undefined | Date[] | QueryPart<any>;
    expiresAtNotIn?: undefined | Date[] | QueryPart<any>;
    expiresAtGreaterThan?: undefined | Date;
    expiresAtLowerThan?: undefined | Date;
    refreshToken?: undefined | string;
    refreshTokenNotEqual?: undefined | string;
    refreshTokenIn?: undefined | string[] | QueryPart<any>;
    refreshTokenNotIn?: undefined | string[] | QueryPart<any>;
    refreshTokenIsNull?: undefined | boolean;
    refreshTokenIsNotNull?: undefined | boolean;
    revokedAt?: undefined | Date;
    revokedAtNotEqual?: undefined | Date;
    revokedAtIn?: undefined | Date[] | QueryPart<any>;
    revokedAtNotIn?: undefined | Date[] | QueryPart<any>;
    revokedAtGreaterThan?: undefined | Date;
    revokedAtLowerThan?: undefined | Date;
    revokedAtIsNull?: undefined | boolean;
    revokedAtIsNotNull?: undefined | boolean;
    viaSession?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreWhere;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    viaRefreshToken?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhere;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    viaAccessToken?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhere;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    accessTokenNotExists?: undefined | StoreSessionStoreTokenWhere;
  };
  type StoreFileUpdate = {
    update: StoreFileUpdatePartial;
    where: StoreFileWhere;
    returning?:
      | undefined
      | "*"
      | (
          | "bucketName"
          | "contentLength"
          | "contentType"
          | "name"
          | "meta"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreFileUpdatePartial = {
    bucketName?: undefined | string | { $append: string };
    contentLength?:
      | undefined
      | number
      | { $add: number }
      | { $subtract: number }
      | { $multiply: number }
      | { $divide: number };
    contentType?: undefined | string | { $append: string };
    name?: undefined | string | { $append: string };
    meta?:
      | undefined
      | {
          transforms?: undefined | any;
          transformedFromOriginal?: undefined | string;
          placeholderImage?: undefined | string;
          altText?: undefined | string;
        }
      | { $set: { path: (number | string)[]; value: any } }
      | { $remove: { path: (number | string)[] } };
    createdAt?: undefined | Date | { $add: string } | { $subtract: string };
    updatedAt?: undefined | Date | { $add: string } | { $subtract: string };
  };
  type StoreJobUpdate = {
    update: StoreJobUpdatePartial;
    where: StoreJobWhere;
    returning?:
      | undefined
      | "*"
      | (
          | "id"
          | "isComplete"
          | "priority"
          | "scheduledAt"
          | "name"
          | "data"
          | "retryCount"
          | "handlerTimeout"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreJobUpdatePartial = {
    isComplete?: undefined | boolean | { $negate: boolean };
    priority?:
      | undefined
      | number
      | { $add: number }
      | { $subtract: number }
      | { $multiply: number }
      | { $divide: number };
    scheduledAt?: undefined | Date | { $add: string } | { $subtract: string };
    name?: undefined | string | { $append: string };
    data?:
      | undefined
      | any
      | { $set: { path: (number | string)[]; value: any } }
      | { $remove: { path: (number | string)[] } };
    retryCount?:
      | undefined
      | number
      | { $add: number }
      | { $subtract: number }
      | { $multiply: number }
      | { $divide: number };
    handlerTimeout?:
      | undefined
      | null
      | number
      | { $add: number }
      | { $subtract: number }
      | { $multiply: number }
      | { $divide: number };
    createdAt?: undefined | Date | { $add: string } | { $subtract: string };
    updatedAt?: undefined | Date | { $add: string } | { $subtract: string };
  };
  type StoreSessionStoreUpdate = {
    update: StoreSessionStoreUpdatePartial;
    where: StoreSessionStoreWhere;
    returning?:
      | undefined
      | "*"
      | (
          | "data"
          | "checksum"
          | "revokedAt"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreSessionStoreUpdatePartial = {
    data?:
      | undefined
      | any
      | { $set: { path: (number | string)[]; value: any } }
      | { $remove: { path: (number | string)[] } };
    checksum?: undefined | string | { $append: string };
    revokedAt?:
      | undefined
      | null
      | Date
      | { $add: string }
      | { $subtract: string };
    createdAt?: undefined | Date | { $add: string } | { $subtract: string };
    updatedAt?: undefined | Date | { $add: string } | { $subtract: string };
  };
  type StoreSessionStoreTokenUpdate = {
    update: StoreSessionStoreTokenUpdatePartial;
    where: StoreSessionStoreTokenWhere;
    returning?:
      | undefined
      | "*"
      | (
          | "expiresAt"
          | "revokedAt"
          | "createdAt"
          | "id"
          | "session"
          | "refreshToken"
        )[];
  };
  type StoreSessionStoreTokenUpdatePartial = {
    expiresAt?: undefined | Date | { $add: string } | { $subtract: string };
    revokedAt?:
      | undefined
      | null
      | Date
      | { $add: string }
      | { $subtract: string };
    createdAt?: undefined | Date | { $add: string } | { $subtract: string };
    session?: undefined | string;
    refreshToken?: undefined | null | string;
  };
  type StoreFileOrderBy =
    | QueryPart<any>
    | ("id" | "bucketName" | "createdAt" | "updatedAt")[];
  type StoreFileOrderBySpec = {
    id?: undefined | CompasOrderBy;
    bucketName?: undefined | CompasOrderBy;
    createdAt?: undefined | CompasOrderBy;
    updatedAt?: undefined | CompasOrderBy;
  };
  type CompasOrderBy = "ASC" | "DESC";
  type StoreJobOrderBy =
    | QueryPart<any>
    | (
        | "id"
        | "isComplete"
        | "name"
        | "scheduledAt"
        | "createdAt"
        | "updatedAt"
      )[];
  type StoreJobOrderBySpec = {
    id?: undefined | CompasOrderBy;
    isComplete?: undefined | CompasOrderByOptional;
    name?: undefined | CompasOrderBy;
    scheduledAt?: undefined | CompasOrderByOptional;
    createdAt?: undefined | CompasOrderBy;
    updatedAt?: undefined | CompasOrderBy;
  };
  type CompasOrderByOptional =
    | "ASC"
    | "DESC"
    | "ASC NULLS FIRST"
    | "DESC NULLS LAST";
  type StoreSessionStoreOrderBy =
    | QueryPart<any>
    | ("id" | "createdAt" | "updatedAt")[];
  type StoreSessionStoreOrderBySpec = {
    id?: undefined | CompasOrderBy;
    createdAt?: undefined | CompasOrderBy;
    updatedAt?: undefined | CompasOrderBy;
  };
  type StoreSessionStoreTokenOrderBy =
    | QueryPart<any>
    | ("id" | "session" | "expiresAt" | "refreshToken" | "revokedAt")[];
  type StoreSessionStoreTokenOrderBySpec = {
    id?: undefined | CompasOrderBy;
    session?: undefined | CompasOrderBy;
    expiresAt?: undefined | CompasOrderBy;
    refreshToken?: undefined | CompasOrderByOptional;
    revokedAt?: undefined | CompasOrderByOptional;
  };
  type StoreFileInsertPartial = {
    id?: undefined | string;
    contentLength: number;
    bucketName: string;
    contentType: string;
    name: string;
    meta?:
      | undefined
      | {
          transforms?: undefined | any;
          transformedFromOriginal?: undefined | string;
          placeholderImage?: undefined | string;
          altText?: undefined | string;
        };
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreJobInsertPartial = {
    id?: undefined | number;
    isComplete?: undefined | boolean;
    handlerTimeout?: undefined | null | number;
    priority?: undefined | number;
    retryCount?: undefined | number;
    name: string;
    scheduledAt?: undefined | Date;
    data?: undefined | any;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreSessionStoreInsertPartial = {
    id?: undefined | string;
    checksum: string;
    revokedAt?: undefined | null | Date;
    data?: undefined | any;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreSessionStoreTokenInsertPartial = {
    id?: undefined | string;
    session: string;
    expiresAt: Date;
    refreshToken?: undefined | null | string;
    revokedAt?: undefined | null | Date;
    createdAt: Date;
  };
  type StoreFileQueryBuilder = {
    where?: undefined | StoreFileWhere;
    orderBy?: undefined | StoreFileOrderBy;
    orderBySpec?: undefined | StoreFileOrderBySpec;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "bucketName"
          | "contentLength"
          | "contentType"
          | "name"
          | "meta"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreJobQueryBuilder = {
    where?: undefined | StoreJobWhere;
    orderBy?: undefined | StoreJobOrderBy;
    orderBySpec?: undefined | StoreJobOrderBySpec;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "id"
          | "isComplete"
          | "priority"
          | "scheduledAt"
          | "name"
          | "data"
          | "retryCount"
          | "handlerTimeout"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreSessionStoreQueryBuilder = {
    where?: undefined | StoreSessionStoreWhere;
    orderBy?: undefined | StoreSessionStoreOrderBy;
    orderBySpec?: undefined | StoreSessionStoreOrderBySpec;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "data"
          | "checksum"
          | "revokedAt"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
    accessTokens?: undefined | StoreSessionStoreTokenQueryBuilder;
  };
  type StoreSessionStoreTokenQueryBuilder = {
    where?: undefined | StoreSessionStoreTokenWhere;
    orderBy?: undefined | StoreSessionStoreTokenOrderBy;
    orderBySpec?: undefined | StoreSessionStoreTokenOrderBySpec;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "expiresAt"
          | "revokedAt"
          | "createdAt"
          | "id"
          | "session"
          | "refreshToken"
        )[];
    session?: undefined | StoreSessionStoreQueryBuilder;
    refreshToken?: undefined | StoreSessionStoreTokenQueryBuilder;
    accessToken?: undefined | StoreSessionStoreTokenQueryBuilder;
  };
  type AuthLogoutResponseInput = AuthLogoutResponse;
  type AuthMeResponseInput = { session: AuthSessionInput };
  type AuthSessionInput = AuthSession;
  type AuthRefreshTokensBodyInput = AuthRefreshTokensBody;
  type AuthTokenPairInput = AuthTokenPair;
  type CompasStructureResponseInput = CompasStructureResponse;
  type CompasOrderByInput = CompasOrderBy;
  type CompasOrderByOptionalInput = CompasOrderByOptional;
  type StoreFileInput = {
    bucketName: string;
    contentLength: number;
    contentType: string;
    name: string;
    meta?: StoreFileMetaInput;
    id: string;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreFileMetaInput =
    | undefined
    | {
        transforms?: undefined | any;
        transformedFromOriginal?: undefined | string;
        placeholderImage?: undefined | string;
        altText?: undefined | string;
      };
  type StoreFileResponseInput = StoreFileResponse;
  type StoreImageTransformOptionsInput = {
    q?: undefined | number | string;
    w: number | string;
  };
  type StoreJobInput = {
    id: number | string;
    isComplete?: undefined | boolean;
    priority?: undefined | number;
    scheduledAt?: undefined | Date;
    name: string;
    data?: undefined | any;
    retryCount?: undefined | number;
    handlerTimeout?: undefined | number;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreSecureImageTransformOptionsInput = {
    accessToken: string;
    q?: undefined | number | string;
    w: number | string;
  };
  type StoreSessionStoreInput = {
    data?: undefined | any;
    checksum: string;
    revokedAt?: undefined | Date;
    id: string;
    createdAt?: undefined | Date;
    updatedAt?: undefined | Date;
  };
  type StoreSessionStoreTokenInput = StoreSessionStoreToken;
  type StoreFileWhereInput = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreFileWhereInput[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    bucketName?: undefined | string;
    bucketNameNotEqual?: undefined | string;
    bucketNameIn?: undefined | string[] | QueryPart<any>;
    bucketNameNotIn?: undefined | string[] | QueryPart<any>;
    bucketNameLike?: undefined | string;
    bucketNameILike?: undefined | string;
    bucketNameNotLike?: undefined | string;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
  };
  type StoreJobWhereInput = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreJobWhereInput[];
    id?: undefined | number | string;
    idNotEqual?: undefined | number | string;
    idIn?: undefined | (number | string)[] | QueryPart<any>;
    idNotIn?: undefined | (number | string)[] | QueryPart<any>;
    idGreaterThan?: undefined | number | string;
    idLowerThan?: undefined | number | string;
    isComplete?: undefined | boolean;
    isCompleteIsNull?: undefined | boolean;
    isCompleteIsNotNull?: undefined | boolean;
    name?: undefined | string;
    nameNotEqual?: undefined | string;
    nameIn?: undefined | string[] | QueryPart<any>;
    nameNotIn?: undefined | string[] | QueryPart<any>;
    nameLike?: undefined | string;
    nameILike?: undefined | string;
    nameNotLike?: undefined | string;
    scheduledAt?: undefined | Date;
    scheduledAtNotEqual?: undefined | Date;
    scheduledAtIn?: undefined | Date[] | QueryPart<any>;
    scheduledAtNotIn?: undefined | Date[] | QueryPart<any>;
    scheduledAtGreaterThan?: undefined | Date;
    scheduledAtLowerThan?: undefined | Date;
    scheduledAtIsNull?: undefined | boolean;
    scheduledAtIsNotNull?: undefined | boolean;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
  };
  type StoreSessionStoreWhereInput = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreSessionStoreWhereInput[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    createdAt?: undefined | Date;
    createdAtNotEqual?: undefined | Date;
    createdAtIn?: undefined | Date[] | QueryPart<any>;
    createdAtNotIn?: undefined | Date[] | QueryPart<any>;
    createdAtGreaterThan?: undefined | Date;
    createdAtLowerThan?: undefined | Date;
    createdAtIsNull?: undefined | boolean;
    createdAtIsNotNull?: undefined | boolean;
    updatedAt?: undefined | Date;
    updatedAtNotEqual?: undefined | Date;
    updatedAtIn?: undefined | Date[] | QueryPart<any>;
    updatedAtNotIn?: undefined | Date[] | QueryPart<any>;
    updatedAtGreaterThan?: undefined | Date;
    updatedAtLowerThan?: undefined | Date;
    updatedAtIsNull?: undefined | boolean;
    updatedAtIsNotNull?: undefined | boolean;
    viaAccessTokens?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhereInput;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    accessTokensNotExists?: undefined | StoreSessionStoreTokenWhereInput;
  };
  type StoreSessionStoreTokenWhereInput = {
    $raw?: undefined | QueryPart<any>;
    $or?: undefined | StoreSessionStoreTokenWhereInput[];
    id?: undefined | string;
    idNotEqual?: undefined | string;
    idIn?: undefined | string[] | QueryPart<any>;
    idNotIn?: undefined | string[] | QueryPart<any>;
    session?: undefined | string;
    sessionNotEqual?: undefined | string;
    sessionIn?: undefined | string[] | QueryPart<any>;
    sessionNotIn?: undefined | string[] | QueryPart<any>;
    expiresAt?: undefined | Date;
    expiresAtNotEqual?: undefined | Date;
    expiresAtIn?: undefined | Date[] | QueryPart<any>;
    expiresAtNotIn?: undefined | Date[] | QueryPart<any>;
    expiresAtGreaterThan?: undefined | Date;
    expiresAtLowerThan?: undefined | Date;
    refreshToken?: undefined | string;
    refreshTokenNotEqual?: undefined | string;
    refreshTokenIn?: undefined | string[] | QueryPart<any>;
    refreshTokenNotIn?: undefined | string[] | QueryPart<any>;
    refreshTokenIsNull?: undefined | boolean;
    refreshTokenIsNotNull?: undefined | boolean;
    revokedAt?: undefined | Date;
    revokedAtNotEqual?: undefined | Date;
    revokedAtIn?: undefined | Date[] | QueryPart<any>;
    revokedAtNotIn?: undefined | Date[] | QueryPart<any>;
    revokedAtGreaterThan?: undefined | Date;
    revokedAtLowerThan?: undefined | Date;
    revokedAtIsNull?: undefined | boolean;
    revokedAtIsNotNull?: undefined | boolean;
    viaSession?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreWhereInput;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    viaRefreshToken?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhereInput;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    viaAccessToken?:
      | undefined
      | {
          where?: undefined | StoreSessionStoreTokenWhereInput;
          limit?: undefined | number;
          offset?: undefined | number;
        };
    accessTokenNotExists?: undefined | StoreSessionStoreTokenWhereInput;
  };
  type StoreFileUpdatePartialInput = StoreFileUpdatePartial;
  type StoreFileUpdateInput = {
    update: StoreFileUpdatePartialInput;
    where: StoreFileWhereInput;
    returning?:
      | undefined
      | "*"
      | (
          | "bucketName"
          | "contentLength"
          | "contentType"
          | "name"
          | "meta"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreFileUpdateFnInput = <I extends StoreFileUpdate>(
    sql: import("@compas/store").Postgres,
    input: I,
  ) => Promise<import("@compas/store").Returning<StoreFile, I["returning"]>>;
  type StoreFileUpdateFn = StoreFileUpdateFnInput;
  type StoreJobUpdatePartialInput = StoreJobUpdatePartial;
  type StoreJobUpdateInput = {
    update: StoreJobUpdatePartialInput;
    where: StoreJobWhereInput;
    returning?:
      | undefined
      | "*"
      | (
          | "id"
          | "isComplete"
          | "priority"
          | "scheduledAt"
          | "name"
          | "data"
          | "retryCount"
          | "handlerTimeout"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreJobUpdateFnInput = <I extends StoreJobUpdate>(
    sql: import("@compas/store").Postgres,
    input: I,
  ) => Promise<import("@compas/store").Returning<StoreJob, I["returning"]>>;
  type StoreJobUpdateFn = StoreJobUpdateFnInput;
  type StoreSessionStoreUpdatePartialInput = StoreSessionStoreUpdatePartial;
  type StoreSessionStoreUpdateInput = {
    update: StoreSessionStoreUpdatePartialInput;
    where: StoreSessionStoreWhereInput;
    returning?:
      | undefined
      | "*"
      | (
          | "data"
          | "checksum"
          | "revokedAt"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreSessionStoreUpdateFnInput = <I extends StoreSessionStoreUpdate>(
    sql: import("@compas/store").Postgres,
    input: I,
  ) => Promise<
    import("@compas/store").Returning<StoreSessionStore, I["returning"]>
  >;
  type StoreSessionStoreUpdateFn = StoreSessionStoreUpdateFnInput;
  type StoreSessionStoreTokenUpdatePartialInput =
    StoreSessionStoreTokenUpdatePartial;
  type StoreSessionStoreTokenUpdateInput = {
    update: StoreSessionStoreTokenUpdatePartialInput;
    where: StoreSessionStoreTokenWhereInput;
    returning?:
      | undefined
      | "*"
      | (
          | "expiresAt"
          | "revokedAt"
          | "createdAt"
          | "id"
          | "session"
          | "refreshToken"
        )[];
  };
  type StoreSessionStoreTokenUpdateFnInput = <
    I extends StoreSessionStoreTokenUpdate,
  >(
    sql: import("@compas/store").Postgres,
    input: I,
  ) => Promise<
    import("@compas/store").Returning<StoreSessionStoreToken, I["returning"]>
  >;
  type StoreSessionStoreTokenUpdateFn = StoreSessionStoreTokenUpdateFnInput;
  type StoreFileOrderByInput = StoreFileOrderBy;
  type StoreFileOrderBySpecInput = {
    id?: undefined | CompasOrderByInput;
    bucketName?: undefined | CompasOrderByInput;
    createdAt?: undefined | CompasOrderByInput;
    updatedAt?: undefined | CompasOrderByInput;
  };
  type StoreJobOrderByInput = StoreJobOrderBy;
  type StoreJobOrderBySpecInput = {
    id?: undefined | CompasOrderByInput;
    isComplete?: undefined | CompasOrderByOptionalInput;
    name?: undefined | CompasOrderByInput;
    scheduledAt?: undefined | CompasOrderByOptionalInput;
    createdAt?: undefined | CompasOrderByInput;
    updatedAt?: undefined | CompasOrderByInput;
  };
  type StoreSessionStoreOrderByInput = StoreSessionStoreOrderBy;
  type StoreSessionStoreOrderBySpecInput = {
    id?: undefined | CompasOrderByInput;
    createdAt?: undefined | CompasOrderByInput;
    updatedAt?: undefined | CompasOrderByInput;
  };
  type StoreSessionStoreTokenOrderByInput = StoreSessionStoreTokenOrderBy;
  type StoreSessionStoreTokenOrderBySpecInput = {
    id?: undefined | CompasOrderByInput;
    session?: undefined | CompasOrderByInput;
    expiresAt?: undefined | CompasOrderByInput;
    refreshToken?: undefined | CompasOrderByOptionalInput;
    revokedAt?: undefined | CompasOrderByOptionalInput;
  };
  type StoreFileQueryBuilderInput = {
    where?: undefined | StoreFileWhereInput;
    orderBy?: undefined | StoreFileOrderByInput;
    orderBySpec?: undefined | StoreFileOrderBySpecInput;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "bucketName"
          | "contentLength"
          | "contentType"
          | "name"
          | "meta"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreJobQueryBuilderInput = {
    where?: undefined | StoreJobWhereInput;
    orderBy?: undefined | StoreJobOrderByInput;
    orderBySpec?: undefined | StoreJobOrderBySpecInput;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "id"
          | "isComplete"
          | "priority"
          | "scheduledAt"
          | "name"
          | "data"
          | "retryCount"
          | "handlerTimeout"
          | "createdAt"
          | "updatedAt"
        )[];
  };
  type StoreSessionStoreQueryBuilderInput = {
    where?: undefined | StoreSessionStoreWhereInput;
    orderBy?: undefined | StoreSessionStoreOrderByInput;
    orderBySpec?: undefined | StoreSessionStoreOrderBySpecInput;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "data"
          | "checksum"
          | "revokedAt"
          | "id"
          | "createdAt"
          | "updatedAt"
        )[];
    accessTokens?: undefined | StoreSessionStoreTokenQueryBuilderInput;
  };
  type StoreSessionStoreTokenQueryBuilderInput = {
    where?: undefined | StoreSessionStoreTokenWhereInput;
    orderBy?: undefined | StoreSessionStoreTokenOrderByInput;
    orderBySpec?: undefined | StoreSessionStoreTokenOrderBySpecInput;
    as?: undefined | string;
    limit?: undefined | number;
    offset?: undefined | number;
    select?:
      | undefined
      | (
          | "expiresAt"
          | "revokedAt"
          | "createdAt"
          | "id"
          | "session"
          | "refreshToken"
        )[];
    session?: undefined | StoreSessionStoreQueryBuilderInput;
    refreshToken?: undefined | StoreSessionStoreTokenQueryBuilderInput;
    accessToken?: undefined | StoreSessionStoreTokenQueryBuilderInput;
  };
  type AuthLoginCtx = Context<
    {},
    {
      event: InsightEvent;
      log: Logger;
    },
    AuthTokenPair
  >;
  type AuthLoginFn = (ctx: AuthLoginCtx, next: Next) => void | Promise<void>;
  type AuthLogoutCtx = Context<
    {},
    {
      event: InsightEvent;
      log: Logger;
    },
    AuthLogoutResponse
  >;
  type AuthLogoutFn = (ctx: AuthLogoutCtx, next: Next) => void | Promise<void>;
  type AuthMeCtx = Context<
    {},
    {
      event: InsightEvent;
      log: Logger;
    },
    AuthMeResponse
  >;
  type AuthMeFn = (ctx: AuthMeCtx, next: Next) => void | Promise<void>;
  type AuthRefreshTokensCtx = Context<
    {},
    {
      event: InsightEvent;
      log: Logger;
      validatedBody: AuthRefreshTokensBody;
    },
    AuthTokenPair
  >;
  type AuthRefreshTokensFn = (
    ctx: AuthRefreshTokensCtx,
    next: Next,
  ) => void | Promise<void>;
  type CompasStructureCtx = Context<
    {},
    {
      event: InsightEvent;
      log: Logger;
    },
    CompasStructureResponse
  >;
  type CompasStructureFn = (
    ctx: CompasStructureCtx,
    next: Next,
  ) => void | Promise<void>;
  type GroupMiddleware = {
    auth: Middleware | Middleware[];
    compas: Middleware | Middleware[];
  };
  type AuthTokenPairApiResponse = AuthTokenPair;
  type AuthLogoutResponseApiResponse = AuthLogoutResponse;
  type AuthMeResponseApiResponse = { session: AuthSessionApiResponse };
  type AuthSessionApiResponse = { id: string; createdAt: string };
  type CompasStructureResponseApiResponse = CompasStructureResponse;
  type QueryResultStoreFile = StoreFile & {};
  type QueryResultStoreJob = StoreJob & {};
  type QueryResultStoreSessionStore = StoreSessionStore & {
    accessTokens?: QueryResultStoreSessionStoreToken[];
  };
  type QueryResultStoreSessionStoreToken = StoreSessionStoreToken & {
    session?: QueryResultStoreSessionStore | string;
    refreshToken?: QueryResultStoreSessionStoreToken | string;
    accessToken?: QueryResultStoreSessionStoreToken | string;
  };
}
