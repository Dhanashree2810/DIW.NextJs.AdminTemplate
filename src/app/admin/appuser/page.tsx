import { verifySession } from '@/app/lib/session';
import AppUserListPage from '@/app/pages/admin/appuser/AppUserListPage';
import { fetchAppUsers } from '@/services/appusers';


export default async function page() {

  const tokendata = await verifySession();
  const appUserData = await fetchAppUsers(tokendata);

  return (
    <div>
      <AppUserListPage appUserData={appUserData}/>
    </div>
  )
}
