import { useEffect, useState } from "react";

import axios from "../services/axios";
import countries from "../constants/countries";

const countryByIso = Object.fromEntries(countries.map((c) => [c.ISO, c.label]));
const CHUNK_SIZE = 50; // ids per request — keeps URLs well under length limits

// Fetches minimal profile info (name, ten, country) for a set of keycloak ids via
// the standard profiles list endpoint (chunked GETs) and returns a map keyed by
// keycloak_id. Ids without a profile are simply absent — callers render a fallback.
export const useProfileBriefs = (keycloakIds) => {
  const [briefs, setBriefs] = useState({});
  const key = [...new Set((keycloakIds || []).filter(Boolean))].sort().join(",");

  useEffect(() => {
    if (!key) return undefined;
    let stale = false; // ignore out-of-order responses after the id set changed
    const ids = key.split(",");
    const chunks = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) chunks.push(ids.slice(i, i + CHUNK_SIZE));

    Promise.all(
      chunks.map((chunk) =>
        axios({
          url: `/profile/v1/profiles?keycloak_id=${chunk.join(",")}&limit=${chunk.length}&skip=0`,
          method: "get",
        })
      )
    )
      // The shared axios instance unwraps responses; this endpoint returns a bare
      // array — or JSON null when a chunk matches no profiles (Go nil slice).
      .then((responses) => {
        if (stale) return;
        const map = {};
        responses.flatMap((r) => r || []).forEach((p) => {
          if (p.deleted) return; // deleted profiles are not display material
          const first = p.first_name_vernacular || p.first_name_latin || "";
          const last = p.last_name_vernacular || p.last_name_latin || "";
          map[p.keycloak_id] = {
            name: `${first} ${last}`.trim(),
            ten: p.name_ten_group || "",
            country: countryByIso[p.country] || p.country || "",
          };
        });
        setBriefs(map);
      })
      .catch((e) => console.error("useProfileBriefs", e));
    return () => { stale = true; };
  }, [key]);

  return briefs;
};
