import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const useRole = () => {
  const { role, _id } = useSelector((state) => state.account);
  const isAdmin = useMemo(() => role === 'admin', [role]);
  const isReceptionist = useMemo(() => role === 'reception', [role]);
  return {
    isAdmin,
    role,
    isReceptionist,
    myId: _id,
  };
};

export default useRole;
