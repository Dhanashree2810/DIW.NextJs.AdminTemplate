import { verifySession } from '@/app/lib/session';
import AppUserHomePage from '@/app/pages/admin/appuser/AppUserHomePage';
import { getHomeCommonData, getHomeUserData, getHtmlData } from '@/services/appusers';


export default async function page() {

  const tokendata = await verifySession();
  const listHomeCommonData = await getHomeCommonData(tokendata);
  const htmlData = await getHtmlData(tokendata);
  const listHomeUserData = await getHomeUserData(tokendata);

  return (
    <div>
      <AppUserHomePage listHomeCommonData={listHomeCommonData} htmlData={htmlData} listHomeUserData={listHomeUserData}/>
    </div>
  )
}
