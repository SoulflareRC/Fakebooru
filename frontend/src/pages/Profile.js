import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileFormCard, ProfileStats } from '../components/profile';
import { SpinnerPage } from '../components/utils';
import * as Context from '../context';


export const ProfileCombined = () => {
  // const {edit,setEdit} = useState(false);
  const { currentUser, loading, setLoading } = Context.useGlobalContext();
  const { profile, setProfile, fetchProfile } = Context.useProfileContext();
  const { id } = useParams();
  useEffect(() => {
    const handleProfile = async () => {
      setLoading(true);
      await fetchProfile(id);
      setLoading(false);
    };
    handleProfile();
  }, []);
  if (loading || profile === null ) {
    return <SpinnerPage />;
  }
  return (
    <div className="w-100 h-100 mx-auto d-grid gap-2 m-2 p-2 overflow-hidden">
      <ProfileFormCard currentUser={currentUser} profile={profile} />
      <ProfileStats profile={profile} />
    </div>
  );
};
