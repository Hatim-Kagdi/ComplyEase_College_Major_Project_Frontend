import { useEffect, useState } from "react"

import MainLayout from "../../components/layouts/MainLayout"

import {
    getRequestedBusinesses,
    getAllCAUsers,
    assignCA
} from "../../services/adminService"

const AssignCA = () => {

    const [businesses, setBusinesses] = useState([])

    const [caUsers, setCaUsers] = useState([])

    const [selectedCA, setSelectedCA] = useState({})

    const fetchData = async () => {

        try {

            const businessResponse =
                await getRequestedBusinesses()

            const caResponse =
                await getAllCAUsers()

            setBusinesses(businessResponse.data)

            setCaUsers(caResponse.data)

        } catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {

        fetchData()

    }, [])

    const handleSelectCA = (businessId, caId) => {

        setSelectedCA({
            ...selectedCA,
            [businessId]: caId
        })
    }

    const handleAssignCA = async (businessId) => {

        try {

            const caId = selectedCA[businessId]

            if (!caId) {

                alert("Please select a CA")

                return
            }

            await assignCA(businessId, caId)

            alert("CA Assigned Successfully")

            fetchData()

        } catch (error) {

            console.log(error)

            alert("Assignment Failed")
        }
    }

    return (

        <MainLayout>

            <div>

                <h1 className="text-3xl font-bold mb-6">
                    Assign CA
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {
                        businesses.map((business) => (

                            <div
                                key={business.businessId}
                                className="bg-white p-6 rounded-lg shadow"
                            >

                                <h2 className="text-xl font-semibold">
                                    {business.businessName}
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    GST:
                                    {" "}
                                    {business.businessGstNumber}
                                </p>

                                <div className="mt-4 flex flex-col gap-3">

                                    <select
                                        value={
                                            selectedCA[
                                                business.businessId
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            handleSelectCA(
                                                business.businessId,
                                                e.target.value
                                            )
                                        }
                                        className="border p-2 rounded"
                                    >

                                        <option value="">
                                            Select CA
                                        </option>

                                        {
                                            caUsers.map((ca) => (

                                                <option
                                                    key={ca.id}
                                                    value={ca.id}
                                                >
                                                    {ca.name}
                                                </option>
                                            ))
                                        }

                                    </select>

                                    <button
                                        onClick={() =>
                                            handleAssignCA(
                                                business.businessId
                                            )
                                        }
                                        className="bg-black text-white py-2 rounded"
                                    >
                                        Assign CA
                                    </button>

                                </div>

                            </div>
                        ))
                    }

                </div>

            </div>

        </MainLayout>
    )
}

export default AssignCA