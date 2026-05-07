import { useEffect, useState } from "react"

import {
    getAssignedBusinesses
} from "../../services/businessService"

const CaDashboard = () => {

    const [businesses, setBusinesses] = useState([])

    const fetchBusinesses = async () => {

        try {

            const response =
                await getAssignedBusinesses()

            setBusinesses(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBusinesses()
    }, [])

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                CA Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {businesses.map((business) => (

                    <div
                        key={business.businessId}
                        className="border rounded-lg p-4 shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {business.businessName}
                        </h2>

                        <p className="mt-2">
                            GST: {business.businessGstNumber}
                        </p>

                        <p className="mt-2">
                            Status: {business.caAssignmentStatus}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    )
}

export default CaDashboard