import { AnimatePresence, motion } from "framer-motion";
import { ResultsType } from "./types";

export function Results({ results }: { results: ResultsType }) {
  return (
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
              {results.tokenResults.map((token, index) => {
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
              {results.totalTokens}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
