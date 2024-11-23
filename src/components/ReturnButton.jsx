import { CircleArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ReturnButton = () => {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)}><CircleArrowLeft size={45} className="cursor-pointer hover:scale-110 duration-200" /></button>
  )
}

export default ReturnButton