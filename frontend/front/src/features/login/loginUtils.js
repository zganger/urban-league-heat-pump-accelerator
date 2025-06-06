import { selectCurrentUser, setLoginInfo } from "./loginSlice";
import { useDispatch, useSelector } from "react-redux";

import jwt_decode from "jwt-decode";
import passwordGenerator from "generate-password-browser";
import { useMemo } from "react";

export const AUTHORIZATION_HEADER = "Authorization";

// TODO: role names subject to change
export const ROLE_ADMIN = "admin";
export const ROLE_SURVEYOR = "surveyor";
export const ROLE_DATA_EDIT = "data_editor";
export const ROLE_DATA_VIEW = "date_viewer";

/*
 * Hook that returns true if the current user has one of the given roles attached to it
 */
export const useUserHasRoles = (allowedRoles) => {
  const currentUser = useSelector(selectCurrentUser);

  return useMemo(
    () => (currentUser?.role ? allowedRoles.includes(currentUser.role) : false),
    [allowedRoles, currentUser?.role]
  );
};

export const AUTH_TOKEN_LOCAL_STORAGE_KEY = "AUTH_TOKEN_LOCAL_STORAGE_KEY";

/*
 * Hook to get the JWT from local storage if it exists
 */
export const useLocallyStoredJWT = () => {
  const dispatch = useDispatch();

  const token = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
  if (!token) {
    return;
  }

  dispatch(setLoginInfo({ token, user: decodeJwt(token) }));
};

export const decodeJwt = (token) => {
  // "sub" = "subject", aka the user id
  const { surveyorId, sub, email, role } = jwt_decode(token);
  return { id: surveyorId, userId: sub, email, role };
};

export const generatePassword = () =>
  // length 6 == shortest password devise will let you set
  passwordGenerator.generate({ numbers: true, strict: true, length: 6 });
