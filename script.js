// Login credentials
const correctId = "podar#ky";
const correctPass = "podar#ky";

// Password to allow TXT file download
const downloadPass = "download123";

// Handle login page
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const pass = document.getElementById("userPass").value;
    if (id === correctId && pass === correctPass) {
      window.location.href = "form.html";
    } else {
      document.getElementById("errorMsg").innerText = "Invalid ID or Password!";
    }
  });
}

// Handle technical issue form page
if (document.getElementById("issueForm")) {
  const issueForm = document.getElementById("issueForm");
  const issueList = document.getElementById("issueList");
  let issues = JSON.parse(localStorage.getItem("issues") || "[]");

  // ⏳ Delete issues older than 1 day
  const oneDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  issues = issues.filter(issue => now - issue.timestamp < oneDay);
  localStorage.setItem("issues", JSON.stringify(issues));

  function renderIssues() {
    issueList.innerHTML = "";
    issues.forEach((issue, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${issue.name} (${issue.className}):</strong> ${issue.text}
                      <br><span style="color: red;">Date: ${issue.date}</span>
                      <br><button onclick="downloadIssue(${index})">Download TXT</button>`;
      issueList.appendChild(li);
    });
  }

  issueForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const className = document.getElementById("classSelect").value;
    const date = document.getElementById("date").value;
    const text = document.getElementById("issue").value;

    const newIssue = { 
      name, 
      className, 
      date,
      text, 
      timestamp: Date.now()
    };
    issues.push(newIssue);
    localStorage.setItem("issues", JSON.stringify(issues));
    renderIssues();

    issueForm.reset();
  });

  window.downloadIssue = function(index) {
    const enteredPass = prompt("Enter password to download this file:");
    if (enteredPass !== downloadPass) {
      alert("Incorrect password! File download cancelled.");
      return;
    }

    const issue = issues[index];
    const content =
`Technical Issue Report
----------------------
Name: ${issue.name}
Class: ${issue.className}
Date: ${issue.date}
Issue: ${issue.text}
----------------------`;

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `issue_${index + 1}.txt`;
    a.click();
  };

  renderIssues();
}
