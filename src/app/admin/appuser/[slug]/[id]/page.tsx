import { fetchAppUsers } from '@/services/appusers';
import { verifySession } from '@/app/lib/session';
import AppUserMainForm from '@/app/pages/admin/appuser/AppUserMainForm';

const EditAppUserPage = async ({ params }: { params: { id: string , type:string} }) => {    
    const tokendata = await verifySession();
    const { id,type } = params;
    let appUserData;

    if (id) {
        const data = await fetchAppUsers(tokendata);        
        appUserData = data.filter((val:any) => val.id == id);
    }

    return <AppUserMainForm appUserData={appUserData[0]} role={type} tokendata={tokendata}/>;    
};

export default EditAppUserPage;