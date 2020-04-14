export default function({$auth,redirect}){
    if($auth.user && $auth.user.master){
        redirect('/');
    }
}