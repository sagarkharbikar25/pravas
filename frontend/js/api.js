async function apiCall(endpoint, formData) {

    try {

        const res = await fetch(API_BASE + endpoint, {
            method: "POST",
            body: formData
        });

        return await res.json();

    } catch (err) {

        console.error("API error:", err);

        return {
            success: false,
            message: "Server error"
        };

    }

}