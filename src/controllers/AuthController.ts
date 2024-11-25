import { supabaseAnon } from '../db/supabaseClient'


const getUsers = async () => {
    const data = { data: [{ id: '1', email: 'goktugcy@gmail.com'}] }
    return data
}

export const AuthController = {
    getUsers
}