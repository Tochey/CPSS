import { useState } from "react"

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
          <div className="p-8 bg-white rounded shadow-md flex flex-col justify-center items-center">
            <img src={''} className="w-24 h-24" alt="logo" />
            <h1 className="text-4xl font-bold my-4">Capstone Submission System</h1>
            <p className="text-gray-700 text-center">Submit your capstone project and get feedback from your peers.</p>
            <div className="my-6 w-full max-w-md">
              <label htmlFor="access-token" className="block text-gray-700 font-bold mb-2">Access Token</label>
              <input id="access-token" name="access-token" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log In</button>
          </div>
        </div>
      );
}

export default App
