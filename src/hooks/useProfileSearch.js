import { useMemo, useState } from "react";

import debounce from "lodash/debounce";

import { ApiCustomers } from "../redux/api/customersApi";

// Debounced profile lookup by any text property (name, email, user id, keycloak id).
// Same backend handler as the spouse search: GET /profile/v1/profiles/search?...&clause=or
export const useProfileSearch = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useMemo(
    () =>
      debounce(async (term) => {
        if (!term || term.length < 2) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const results = await ApiCustomers.search(
            { email: term, name: term, user_id: term, keycloak_id: term },
            "or"
          );
          setOptions(results || []);
        } catch (error) {
          console.error("Profile search failed", error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  return { options, loading, search };
};
