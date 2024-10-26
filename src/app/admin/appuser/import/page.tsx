import { verifySession } from '@/app/lib/session';
import AppUserImportPage from '@/app/pages/admin/appuser/AppUserImportPage';


export default async function page() {
  const tokendata = await verifySession();
  return (
    <div>
      <AppUserImportPage tokendata={tokendata}/>
    </div>
  )
}
