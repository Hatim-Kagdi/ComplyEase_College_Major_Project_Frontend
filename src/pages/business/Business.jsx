import { useEffect, useState } from "react"

import {
    createBusiness,
    getBusinesses,
    deleteBusiness,
    updateBusiness
} from "../../services/businessService"

import MainLayout from "../../components/layouts/MainLayout"

const Business = () => {

    const [businesses, setBusinesses] = useState([])

    const [formData, setFormData] = useState({
        businessName: "",
        businessGstNumber: ""
    })

    const [editingId, setEditingId] = useState(null)

    // FETCH BUSINESSES
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

    // HANDLE INPUT CHANGE
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // CREATE OR UPDATE BUSINESS
    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            // UPDATE
            if (editingId) {

                await updateBusiness(editingId, formData)

                alert("Business Updated")

                setEditingId(null)
            }

            // CREATE
            else {

                await createBusiness(formData)

                alert("Business Created")
            }

            // CLEAR FORM
            setFormData({
                businessName: "",
                businessGstNumber: ""
            })

            // REFRESH DATA
            fetchBusinesses()

        } catch (error) {

            console.log(error)

            alert("Operation Failed")
        }
    }

    // DELETE BUSINESS
    const handleDelete = async (id) => {

        try {

            await deleteBusiness(id)

            alert("Business Deleted")

            fetchBusinesses()

        } catch (error) {

            console.log(error)

            alert("Delete Failed")
        }
    }

    // EDIT BUSINESS
    const handleEdit = (business) => {

        setEditingId(business.businessId)

        setFormData({
            businessName: business.businessName,
            businessGstNumber: business.businessGstNumber
        })
    }

    return (
      <MainLayout>

        <div className="min-h-screen p-8">

            <h1 className="text-3xl font-bold mb-6">
                Business Management
            </h1>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="border p-6 rounded-lg flex flex-col gap-4 max-w-md"
            >

                <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    name="businessGstNumber"
                    placeholder="Enter GST Number"
                    value={formData.businessGstNumber}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="bg-black text-white p-2 rounded"
                >
                    {
                        editingId
                            ? "Update Business"
                            : "Create Business"
                    }
                </button>

            </form>

            {/* BUSINESS LIST */}
            <div className="mt-10">

                <h2 className="text-2xl font-semibold mb-4">
                    Your Businesses
                </h2>

                <div className="flex flex-col gap-4">

                    {
                        businesses.map((business) => (

                            <div
                                key={business.businessId}
                                className="border p-4 rounded-lg flex justify-between items-center"
                            >

                                <div>

                                    <h3 className="font-bold text-lg">
                                        {business.businessName}
                                    </h3>

                                    <p>
                                        GST:
                                        {" "}
                                        {business.businessGstNumber}
                                    </p>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => handleEdit(business)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(business.businessId)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
        </MainLayout>
    )
}

export default Business