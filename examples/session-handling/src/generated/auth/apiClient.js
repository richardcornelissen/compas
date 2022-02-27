// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import FormData from "form-data";
import { isPlainObject } from "@compas/stdlib";
import * as validators from "./validators.js";
import { handleError } from "../common/apiClient.js";

/**
 *
 *
 * @param {AxiosInstance} instance
 * @param { { signal?: AbortSignal | undefined } } [requestConfig]
 * @returns {Promise<AuthTokenPairApiResponse>}
 */
export async function apiAuthLogin(instance, requestConfig = {}) {
  try {
    const response = await instance.request({
      url: `auth/login`,
      method: "post",
      ...requestConfig,
    });
    const { error } = validators.validateAuthTokenPair(response.data);
    if (error) {
      throw error;
    }
    return response.data;
  } catch (e) {
    return handleError(e, "auth", "login");
  }
}

/**
 *
 *
 * @param {AxiosInstance} instance
 * @param { { signal?: AbortSignal | undefined } } [requestConfig]
 * @returns {Promise<AuthLogoutResponseApiResponse>}
 */
export async function apiAuthLogout(instance, requestConfig = {}) {
  try {
    const response = await instance.request({
      url: `auth/logout`,
      method: "post",
      ...requestConfig,
    });
    const { error } = validators.validateAuthLogoutResponse(response.data);
    if (error) {
      throw error;
    }
    return response.data;
  } catch (e) {
    return handleError(e, "auth", "logout");
  }
}

/**
 *
 *
 * @param {AxiosInstance} instance
 * @param { { signal?: AbortSignal | undefined } } [requestConfig]
 * @returns {Promise<AuthMeResponseApiResponse>}
 */
export async function apiAuthMe(instance, requestConfig = {}) {
  try {
    const response = await instance.request({
      url: `auth/me`,
      method: "get",
      ...requestConfig,
    });
    const { error } = validators.validateAuthMeResponse(response.data);
    if (error) {
      throw error;
    }
    return response.data;
  } catch (e) {
    return handleError(e, "auth", "me");
  }
}

/**
 *
 *
 * @param {AxiosInstance} instance
 * @param { AuthRefreshTokensBodyInput } body
 * @param { { signal?: AbortSignal | undefined } } [requestConfig]
 * @returns {Promise<AuthTokenPairApiResponse>}
 */
export async function apiAuthRefreshTokens(instance, body, requestConfig = {}) {
  const data = body;
  try {
    const response = await instance.request({
      url: `auth/refresh`,
      method: "post",
      data,
      ...requestConfig,
    });
    const { error } = validators.validateAuthTokenPair(response.data);
    if (error) {
      throw error;
    }
    return response.data;
  } catch (e) {
    return handleError(e, "auth", "refreshTokens");
  }
}
