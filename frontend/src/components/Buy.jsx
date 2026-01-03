import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'

const Buy = () => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [loading, setLoading] = useState(false)
    const [course, setCourse] = useState({})
    const [clientSecret, setClientSecret] = useState("")
    const [error, setError] = useState("")
    const [cardError, setCardError] = useState("")

    const user = JSON.parse(localStorage.getItem('user'))
    const token = user?.token
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const fetchBuyCourse = async () => {
            if (!token) {
                setError("Please login to purchase the course")
                return;
            }
            try {
                const response = await axios.post(`${BACKEND_URL}/course/buy/${courseId}`, {}, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }, withCredentials: true
                })
                setCourse(response.data.course)
                setClientSecret(response.data.client_Secret)
            } catch (error) {
                setLoading(false)
                if (error.response) {
                    const errors = error.response.data.errors;
                    setError(errors || "Error in purchasing Course")
                    if (errors === 'Course already purchased') {
                        toast.success("You have already purchased this course")
                        navigate('/purchases')
                    }
                }
                else {
                    setError("Error in purchasing course")
                }
            }
        }
        fetchBuyCourse()
    }, [courseId])

    const handlePurchase = async (e) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setLoading(true)
        setCardError("")

        const card = elements.getElement(CardElement)
        if (!card) {
            setCardError("Card element not found")
            setLoading(false)
            return
        }

        if (!clientSecret) {
            setCardError("Client secret missing")
            setLoading(false)
            return
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card,
                    billing_details: {
                        name: user?.user?.firstName,
                        email: user?.user?.email,
                    },
                },
            }
        )

        if (error) {
            setCardError(error.message)
            setLoading(false)
            return
        }

        if (paymentIntent.status === "succeeded") {
            const paymentInfo = {
                email: user?.user?.email,
                userId: user.id,
                courseId,
                paymentId: paymentIntent.id,
                amount: paymentIntent.amount,
                status: paymentIntent.status,
            }

            try {
                await axios.post(
                    'http://localhost:3000/api/v1/order',
                    paymentInfo,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                )

                toast.success("Payment successful")
                navigate('/purchases')
            } catch (err) {
                toast.error("Payment succeeded but order failed")
            }
        }

        setLoading(false)
    }


    return (
        <>
            {error ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                        <p className="text-lg font-semibold">{error}</p>
                        <Link
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
                            to={"/login"}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row my-40 container mx-auto">
                    <div className="flex flex-col items-start pt-6 pl-5 w-full md:w-1/2">
                        <h1 className="text-xl font-semibold underline">Order Details</h1>
                        <div className="flex items-center text-center space-x-2 mt-4">
                            <h2 className="text-gray-600 text-sm">Total Price</h2>
                            <p className="text-red-500 font-bold">${course.price}</p>
                        </div>
                        <div className="flex items-center text-center space-x-2">
                            <h1 className="text-gray-600 text-sm">Course name</h1>
                            <p className="text-red-500 font-bold">{course.title}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
                            <h2 className="text-lg font-semibold mb-4">
                                Process your Payment!
                            </h2>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm mb-2"
                                    htmlFor="card-number"
                                >
                                    Credit/Debit Card
                                </label>
                                <form onSubmit={handlePurchase}>
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "16px",
                                                    color: "#424770",
                                                    "::placeholder": {
                                                        color: "#aab7c4",
                                                    },
                                                },
                                                invalid: {
                                                    color: "#9e2146",
                                                },
                                            },
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={!stripe || loading} // Disable button when loading
                                        className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                                    >
                                        {loading ? "Processing..." : "Pay"}
                                    </button>
                                </form>
                                {cardError && (
                                    <p className="text-red-500 font-semibold text-xs">
                                        {cardError}
                                    </p>
                                )}
                            </div>

                            <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                                <span className="mr-2">🅿️</span> Other Payments Method
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Buy
