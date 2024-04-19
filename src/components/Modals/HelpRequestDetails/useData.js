import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { updateRequest } from "../../../redux/actions/helpHaverActions";

const TABS = [
  { value: "request", label: "HelpHaver.request" },
  { value: "personalInfo", label: "HelpHaver.personalInfo" },
  { value: "notifications ", label: "HelpHaver.notifications" },
];

const STATUSES = [
  { value: "requested", label: "HelpHaver.requested" },
  { value: "approved", label: "HelpHaver.approved" },
  { value: "rejected", label: "HelpHaver.rejected" },
];

export const useData = (id, useModal) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(TABS[0].value);
  const [rejectionNote, setRejectionNote] = useState("");
  const [period, setPeriod] = useState(1);
  const [status, setStatus] = useState();
  const { membershipGrants, membershipRequests, requestorDetails } =
    useSelector((state) => state.helpHaverReducer);

  const requestInfo = useMemo(
    () => membershipRequests.find((req) => req.id === id),
    [id, membershipRequests]
  );

  const grantInfo = useMemo(
    () => membershipGrants.find((req) => req.request_id === id),
    [id, membershipGrants]
  );

  const isDisabledBtn = useMemo(
    () =>
      status === "requested" ||
      (status === requestInfo?.status?.toLowerCase() &&
        grantInfo?.properties?.months === Number(period)),
    [grantInfo, period, requestInfo, status]
  );

  useEffect(() => {
    setStatus(requestInfo?.status?.toLowerCase());
  }, [requestInfo]);

  useEffect(() => {
    if (grantInfo?.properties?.months) {
      setPeriod(grantInfo?.properties?.months);
    }
  }, [grantInfo]);

  useEffect(() => {
    if (!useModal.isVisible) {
      setTimeout(() => setCurrentTab(TABS[0].value), 500);
    }
  }, [useModal.isVisible]);

  const onPressUpdate = () => {
    if (isDisabledBtn) return;

    const payload = {};

    if (status === "approved") {
      payload.approved = true;
      payload.months = Number(period);
    } else {
      payload.approved = false;
      payload.rejection_note = rejectionNote;
    }

    dispatch(updateRequest(requestInfo?.id, payload, useModal.hideModal));
  };

  const onChangeStatus = (val) => {
    if (requestInfo?.status !== "REQUESTED") {
      return;
    }

    setStatus(val);
  };

  return {
    TABS,
    period,
    setPeriod,
    STATUSES,
    status,
    onChangeStatus,
    grantInfo,
    currentTab,
    requestInfo,
    setCurrentTab,
    onPressUpdate,
    rejectionNote,
    isDisabledBtn,
    setRejectionNote,
    requestorDetails,
  };
};
