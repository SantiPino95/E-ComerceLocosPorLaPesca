import { createContext, useContext , useState } from "react";
import { supabase } from "../Lib/supabase";

const ClienteContext = createContext()


export function ClienteProvider ({children}) {

const [cliente , setCliente] = useState (null)


// Loguin por cedula de identidad 
const login = async (cedula) => {

const {data} = await supabase.from('cliente').select('*').eq('cedula', cedula).maybeSingle()


if ( !data) return {ok: false , mensaje : 'Cedula no encontrada , ¿ya te registraste?'}
setCliente(data)
return {ok:true}

}


//Registro toma de datos personales 

const registro = async (nombre, apellido, telefono, cedula) => 
{
const {data : existe} = await supabase.from('cliente').select('id').eq('cedula', cedula).maybeSingle()


if(existe) return {ok: false , mensaje : 'Ya existe una cuenta con esa cedula'}

const {data, error} = await supabase.from('cliente').insert([{nombre, apellido, telefono, cedula}]).select().maybeSingle()

if(error) return {ok: false , mensaje : 'Error alregistrarse'}
setCliente(data)
return {ok:true}
}

//creo logout para despues vinculas al boton 

const logout = () => setCliente(null)


return (
<ClienteContext.Provider value={{cliente, login, registro, logout}}>
    {children}
</ClienteContext.Provider>


)

}

export const useCliente = () => useContext(ClienteContext)



