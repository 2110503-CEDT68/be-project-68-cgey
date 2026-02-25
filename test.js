const http = require("http");

async function req(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: "localhost",
            port: process.env.PORT || 5050,
            path: path,
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (data) {
            options.headers["Content-Length"] = Buffer.byteLength(data);
        }
        if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
        }

        const request = http.request(options, (res) => {
            let responseBody = "";
            res.on("data", (chunk) => {
                responseBody += chunk;
            });
            res.on("end", () => {
                try {
                    if (responseBody) {
                        resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
                    } else {
                        resolve({ status: res.statusCode, data: {} });
                    }
                } catch (err) {
                    resolve({ status: res.statusCode, data: responseBody });
                }
            });
        });

        request.on("error", (err) => {
            reject(err);
        });

        if (data) {
            request.write(data);
        }
        request.end();
    });
}

(async () => {
    try {
        console.log("--- STARTING TESTS ---");

        // 1. Register a test user
        const email = `testuser_${Date.now()}@test.com`;
        console.log(`Registering user: ${email}`);
        const regRes = await req("POST", "/api/v1/auth/register", {
            name: "Test User",
            email: email,
            password: "password123",
            tel: "1234567890",
            role: "user"
        });

        if (regRes.status !== 200 && regRes.status !== 201) {
            console.log(`Failed to register (Status ${regRes.status}):`, typeof regRes.data === 'object' ? JSON.stringify(regRes.data) : regRes.data);
            return;
        }
        const token = regRes.data.token;
        console.log("Got token.");

        // 2. Get a hospital
        console.log("Fetching hospitals...");
        const hospRes = await req("GET", "/api/v1/hospitals");
        if (hospRes.status !== 200 || !hospRes.data.data || hospRes.data.data.length === 0) {
            console.log("Failed to fetch hospitals or no hospitals found.");
            return;
        }
        const hospitalId = hospRes.data.data[0]._id;
        console.log(`Found hospital: ${hospitalId}`);

        // 3. POST /hospitals/:id/appointments
        console.log(`Creating appointment at hospital ${hospitalId}...`);
        const date = new Date(Date.now() + 86400000).toISOString(); // tomorrow
        const addAppTRes = await req("POST", `/api/v1/hospitals/${hospitalId}/appointments`, {
            apptDate: date
        }, token);

        console.log("POST Appointment Response:", addAppTRes.status, addAppTRes.data);
        if (addAppTRes.status !== 201) return;

        const appointmentId = addAppTRes.data.data._id;

        // 4. GET /appointments (all)
        console.log("Fetching all appointments...");
        const getAppTsRes = await req("GET", "/api/v1/appointments", null, token);
        console.log("GET All Appointments Response:", getAppTsRes.status, `Count: ${getAppTsRes.data.count}`);

        // 5. GET /appointments/:id (single)
        console.log(`Fetching single appointment ${appointmentId}...`);
        const getAppTRes = await req("GET", `/api/v1/appointments/${appointmentId}`, null, token);
        console.log("GET Single Appointment Response:", getAppTRes.status, !!getAppTRes.data.data ? "Success" : getAppTRes.data);

        // 6. PUT /appointments/:id
        console.log(`Updating appointment ${appointmentId}...`);
        const newDate = new Date(Date.now() + 172800000).toISOString(); // day after tomorrow
        const updateAppTRes = await req("PUT", `/api/v1/appointments/${appointmentId}`, {
            apptDate: newDate
        }, token);
        console.log("PUT Appointment Response:", updateAppTRes.status, !!updateAppTRes.data.data ? "Success" : updateAppTRes.data);

        // 7. DELETE /appointments/:id
        console.log(`Deleting appointment ${appointmentId}...`);
        const delAppTRes = await req("DELETE", `/api/v1/appointments/${appointmentId}`, null, token);
        console.log("DELETE Appointment Response:", delAppTRes.status, delAppTRes.data);

        console.log("--- ALL TESTS COMPLETED ---");
    } catch (err) {
        console.error("Test failed with error:", err);
    }
})();
