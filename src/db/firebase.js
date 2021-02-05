import db from './index'

export const firebaseUpload = async (payload )=>{
    console.log(payload)
    const {id,projectName} = payload
    const data = payload[projectName]

    console.log(data)
    console.log(db)
    const user = await db
      .ref(`users/${id}/${projectName}/`)
      .set({ data });
    res.status(201).json(user);
    console.log(user)
  }