"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Crown, Minus } from "lucide-react";
import Image from "next/image";

interface TokenType {
  id: string;
  name: string;
  count: number;
}

interface Results {
  tokenResults: TokenType[];
  totalTokens: number;
}

function resolveTrigger(
  remainingTriggers: number,
  permanentsCount: number,
  tokenDoublers: number,
  tokens: TokenType[]
) {
  const tokensCopy = structuredClone(tokens);
  let updatedPermanentsCount = permanentsCount;
  if (remainingTriggers === 0)
    if (updatedPermanentsCount < 10) {
      return {
        tokenResults: [tokensCopy[0]],
        totalTokens: tokensCopy[0].count,
      };
    } else {
      return {
        tokenResults: tokensCopy,
        totalTokens: tokens.reduce((acc, token) => acc + token.count, 0),
      } as Results;
    }
  const catsToCreate = 1 * Math.pow(2, tokenDoublers);
  if (
    tokensCopy.length === 0 ||
    tokensCopy[0].name !== "1/1 white Cat creature"
  ) {
    tokensCopy.unshift({
      id: "1/1 white Cat creature",
      name: "1/1 white Cat creature",
      count: catsToCreate,
    });
    updatedPermanentsCount += catsToCreate;
  } else {
    tokensCopy[0].count += catsToCreate;
    updatedPermanentsCount += catsToCreate;
  }

  if (updatedPermanentsCount >= 10) {
    tokensCopy.forEach((token) => {
      token.count = token.count + token.count * Math.pow(2, tokenDoublers);
    });
  }

  return resolveTrigger(
    remainingTriggers - 1,
    updatedPermanentsCount,
    tokenDoublers,
    tokensCopy
  );
}

interface FormState {
  ocelotPrideCount: number;
  tokensCreatedThisTurn: number;
  permanentsCount: number;
  triggerDoublers: number;
  tokenDoublers: number;
  tokens: TokenType[];
}

const App = () => {
  const [formState, setFormState] = useState<FormState>({
    ocelotPrideCount: 1,
    tokensCreatedThisTurn: 0,
    permanentsCount: 10,
    triggerDoublers: 0,
    tokenDoublers: 0,
    tokens: [],
  });

  const calculatedTokens = useMemo(() => {
    return resolveTrigger(
      formState.ocelotPrideCount * (formState.triggerDoublers + 1),
      formState.permanentsCount,
      formState.tokenDoublers,
      formState.tokens
    );
  }, [formState]);

  const handleInputChange = (
    field: keyof FormState,
    value: number | boolean | TokenType[]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTokenType = () => {
    handleInputChange("tokens", [
      ...formState.tokens,
      { id: Date.now().toString(), name: "", count: 1 },
    ]);
  };

  const updateTokenName = (id: string, name: string) => {
    handleInputChange(
      "tokens",
      formState.tokens.map((token) =>
        token.id === id ? { ...token, name } : token
      )
    );
  };

  const updateTokenCount = (id: string, count: number) => {
    handleInputChange(
      "tokens",
      formState.tokens.map((token) =>
        token.id === id ? { ...token, count } : token
      )
    );
  };

  const removeTokenType = (id: string) => {
    handleInputChange(
      "tokens",
      formState.tokens.filter((token) => token.id !== id)
    );
  };

  const InputField = ({
    label,
    field,
    min = 0,
    value,
  }: {
    label: string;
    field: keyof FormState;
    min?: number;
    value: number | boolean;
    type?: string;
  }) => (
    <div className="flex flex-col gap-2 py-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        value={value as number}
        onChange={(e) =>
          handleInputChange(field, Math.max(min, parseInt(e.target.value) || 0))
        }
        className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4 py-8 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Ocelot Pride Calculator
          </h1>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Card Image */}
          <div className="flex-1">
            <Image
              src="/ocelot-pride.jpg"
              alt="Ocelot Pride"
              className="w-full rounded-lg shadow-md"
              width={200}
              height={400}
            />
          </div>

          {/* Form Inputs */}
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl flex-1 space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-t-2xl" />
            <div className="px-8 pb-4">
              <InputField
                label="Number of Ocelot Prides"
                field="ocelotPrideCount"
                min={1}
                value={formState.ocelotPrideCount}
              />
              <InputField
                label="Total permanents controlled"
                field="permanentsCount"
                value={formState.permanentsCount}
              />
              <AnimatePresence>
                {formState.permanentsCount >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-sm text-green-600 mt-1 bg-green-50 p-2 rounded-md"
                  >
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <p>You have the city&apos;s blessing!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Trigger doublers"
                  field="triggerDoublers"
                  value={formState.triggerDoublers}
                />
                <InputField
                  label="Token doublers"
                  field="tokenDoublers"
                  value={formState.tokenDoublers}
                />
              </div>
              <hr className="my-5" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Tokens created this turn
                  </label>
                  <button
                    onClick={addTokenType}
                    className="flex items-center text-xs px-3 py-2 rounded-md border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 font-medium shadow-sm transition-all duration-200 hover:shadow"
                  >
                    <Plus className="text-amber-500 h-4 w-4 mr-2" />
                    Add Token
                  </button>
                </div>

                {formState.tokens.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
                    <p>No tokens added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {formState.tokens.map((token, idx) => (
                        <motion.div
                          key={token.id}
                          className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.2 },
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">
                              Token Name
                            </label>
                            <input
                              id={`token-name-${token.id}`}
                              value={token.name}
                              onChange={(e) =>
                                updateTokenName(token.id, e.target.value)
                              }
                              placeholder="Token name"
                              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              autoFocus={idx === formState.tokens.length - 1}
                            />
                          </div>
                          <div className="w-20">
                            <label className="text-xs text-gray-500 mb-1 block">
                              Count
                            </label>
                            <input
                              id={`token-count-${token.id}`}
                              type="number"
                              min="1"
                              value={token.count}
                              onChange={(e) =>
                                updateTokenCount(
                                  token.id,
                                  Number.parseInt(e.target.value) || 1
                                )
                              }
                              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTokenType(token.id)}
                            className="p-2 rounded-full mb-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 flex items-center justify-center"
                            aria-label="Remove token"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}

        <div className="mt-8 w-full bg-white rounded-2xl shadow-xl flex-1 space-y-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-t-2xl" />
          <div className="px-6 pb-4">
            <header>
              <div className="flex items-center gap-2 mb-2 text-lg font-medium text-gray-700">
                Token Creation Breakdown
              </div>
            </header>
            <div className="space-y-5">
              <div className="grid gap-3">
                <AnimatePresence>
                  {calculatedTokens.tokenResults.map((token, index) => {
                    return (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-lg shadow-sm border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2 },
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-amber-700">
                                {token.name} tokens
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-3xl font-bold text-amber-700">
                              {token.count}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            <hr className="my-5" />
            <div className="flex justify-between items-center p-4 rounded-lg shadow-sm border border-amber-600 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-amber-900">
                    Total Tokens Created
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-amber-900">
                  {calculatedTokens.totalTokens}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
