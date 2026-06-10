import { useEffect, useState } from "react";
import { getUniqueQbNames } from "../utils/qbTransformations";
import type { QBRecord } from "../types/api";

interface UseQbComparisonSelectionResult {
  qb1: string;
  qb2: string;
  setQb1: (name: string) => void;
  setQb2: (name: string) => void;
  canCompare: boolean;
}

export function useQbComparisonSelection(
  qbs: QBRecord[]
): UseQbComparisonSelectionResult {
  const qbNames = getUniqueQbNames(qbs);
  const [qb1, setQb1] = useState("");
  const [qb2, setQb2] = useState("");

  useEffect(() => {
    if (qbNames.length === 0) {
      setQb1("");
      setQb2("");
      return;
    }

    setQb1((current) =>
      current && qbNames.includes(current) ? current : qbNames[0]
    );
    setQb2((current) => {
      if (current && qbNames.includes(current) && current !== qbNames[0]) {
        return current;
      }

      return qbNames[1] ?? qbNames[0];
    });
  }, [qbNames]);

  return {
    qb1,
    qb2,
    setQb1,
    setQb2,
    canCompare: qbNames.length >= 2,
  };
}
