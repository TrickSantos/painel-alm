import { useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return useMemo(() => {
    return {
      navigate,
      location,
      params,
      state: location.state,
    };
  }, [params, location, history]);
};
export default useRouter;
