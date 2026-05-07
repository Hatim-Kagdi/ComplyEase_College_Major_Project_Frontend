import { useEffect, useState } from "react"
import {
    getBusinesses,
    requestCA
} from "../../services/businessService"
import MainLayout from "../../components/layouts/MainLayout"

const UserDashboard = () => {

    const [businesses, setBusinesses] = useState([])

    const fetchBusinesses = async () => {
        try {

            const response = await getBusinesses()

            setBusinesses(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBusinesses()
    }, [])

    const handleRequestCA = async (businessId) => {

        try {

            await requestCA(businessId)

            fetchBusinesses()

        } catch (error) {
            console.log(error)
            alert("Failed to request CA")
        }
    }

    return (
      <MainLayout>
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                User Dashboard
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

                        <p className="mt-2 font-medium">
                            Status: {business.caAssignmentStatus}
                        </p>

                        {
                            business.caAssignmentStatus === "NO_CA" && (
                                <button
                                    onClick={() =>
                                        handleRequestCA(
                                            business.businessId
                                        )
                                    }
                                    className="mt-4 bg-black text-white px-4 py-2 rounded"
                                >
                                    Request CA
                                </button>
                            )
                        }

                    </div>
                ))}

            </div>

        </div>
        </MainLayout>
    )
}

export default UserDashboard