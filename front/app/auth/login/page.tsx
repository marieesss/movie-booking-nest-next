"use client";

import { login } from "@/api/auth";
import Alerts from "@/components/alerts";
import { setAuthToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
  
  
    try {
      const result = await login(formData);
    
      if (!result.success) {
        const errorMessage =
          typeof result.error === "object" && "error" in result.error
            ? result.error.error
            : result.error;
        setErrorMessage(errorMessage || "Une erreur est survenue");
        return;
      }


  
      if (result.data?.data?.token) {
        setAuthToken(result.data.data.token);
        router.push("/movies")
      }
  
    } catch (error) {
      console.error( error);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">Créer un compte</h2>

        {errorMessage && <Alerts text={errorMessage} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="exemple@email.com"
              required
            />
          </div>


          {/* Champ Mot de Passe */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Pas de compte ? <a href="/auth/register" className="text-blue-600 hover:underline">Inscrivez vous</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
