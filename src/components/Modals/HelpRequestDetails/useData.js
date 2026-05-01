/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  updateRequest,
  fetchUserRequestHistory,
} from "../../../redux/actions/helpHaverActions";
import { REQUESTED } from "../../../constants/statuses";

const VALID_HH_TYPES = new Set(["hh_hayal", "hh_gimlaj", "hh_other"]);

function normalizeHHType(type) {
  if (!type) return "";
  const normalized = type.replace("hh-", "hh_");
  return VALID_HH_TYPES.has(normalized) ? normalized : "";
}

const STATUSES = [
  { value: "requested", label: "HelpHaver.requested" },
  { value: "approved", label: "HelpHaver.approved" },
  { value: "rejected", label: "HelpHaver.rejected" },
];

export const useData = (id, useModal, page, rowsPerPage) => {
  const dispatch = useDispatch();
  const [rejectionNote, setRejectionNote] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState();
  const [hhType, setHhType] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const { membershipGrants, membershipRequests, requestorDetails, userRequestHistory } =
    useSelector((state) => state.helpHaverReducer);

  const requestInfo = useMemo(
    () => membershipRequests.find((req) => req.id === id),
    [id, membershipRequests]
  );

  const grantInfo = useMemo(
    () => membershipGrants.find((req) => req.request_id === id),
    [id, membershipGrants]
  );

  const isStatusLocked = requestInfo?.status !== REQUESTED;

  const isDisabledBtn = useMemo(() => {
    if (isStatusLocked) return true;
    if (status === "requested") return true;
    if (status !== requestInfo?.status?.toLowerCase()) return false;
    const p = grantInfo?.properties ?? {};
    if (p.months !== Number(period) || p.type !== hhType) return false;
    return p.discount_pct === Number(discountPct);
  }, [grantInfo, period, hhType, discountPct, requestInfo, status, isStatusLocked]);

  useEffect(() => {
    if (requestInfo?.keycloak_id) {
      dispatch(fetchUserRequestHistory(requestInfo.keycloak_id));
    }
  }, [requestInfo?.keycloak_id]);

  useEffect(() => {
    setStatus(requestInfo?.status?.toLowerCase());
    if (requestInfo?.status !== REQUESTED) {
      setPeriod("");
      setHhType("");
      setDiscountPct("");
    } else {
      const p = requestInfo?.properties ?? {};
      setPeriod(p.months ?? "");
      setHhType(normalizeHHType(requestInfo?.type));
      setDiscountPct(p.discount_pct ?? "");
    }
  }, [requestInfo, grantInfo]);

  const onPressUpdate = () => {
    if (isDisabledBtn) return;

    const payload = {};

    if (status === "approved") {
      payload.approved = true;
      payload.type = hhType;
      payload.properties = { months: Number(period), discount_pct: Number(discountPct) };
    } else {
      payload.approved = false;
      payload.rejection_note = rejectionNote;
    }

    dispatch(
      updateRequest(
        requestInfo?.id,
        payload,
        useModal.hideModal,
        rowsPerPage,
        page
      )
    );
  };

  const onChangeStatus = (val) => {
    if (requestInfo?.status !== REQUESTED) {
      return;
    }

    setStatus(val);
  };

  return {
    period,
    setPeriod,
    hhType,
    setHhType,
    discountPct,
    setDiscountPct,
    STATUSES,
    status,
    onChangeStatus,
    requestInfo,
    onPressUpdate,
    rejectionNote,
    isDisabledBtn,
    isStatusLocked,
    setRejectionNote,
    requestorDetails,
    userRequestHistory,
  };
};
