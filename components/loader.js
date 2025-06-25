/** @format */

export const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-600">
                    Loading enquiries...
                </p>
            </div>
        </div>
    );
};
