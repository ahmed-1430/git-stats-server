export const fetchGitHubData = async (query, variables) => {
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    console.log("GitHub API Response:", JSON.stringify(json, null, 2)); // 👈 ADD THIS

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    return json.data;
};