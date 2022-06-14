import React, { useEffect } from 'react'
import axios from 'axios'


const OpenDart = (): JSX.Element => {
    useEffect(() => {
        const getOpenDartData = async () => {
            try {
                const { data: { list } } = await axios.get(`dartAPI/cvbdIsDecsn.json?crtfc_key=${process.env.REACT_APP_DART_API_KEY}&corp_code=00287812&bgn_de=20210601&end_de=20220611`)
                console.log(list)
            } catch (e) {
                console.log(e)
            }
        }
        getOpenDartData()
    }, [])
    return (
        <div>OpenDart</div>
    )
}


export default OpenDart;