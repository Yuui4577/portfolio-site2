fetch("./works.csv")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("works.csvを読み込めません: " + response.status);
        }
        return response.text();
    })
    .then(function(data) {

        var rows = data.trim().split(/\r?\n/);
        var headers = rows[0].split(",").map(function(h) {
            return h.trim();
        });

        var works = rows.slice(1).map(function(row) {
            var values = row.split(",");
            var work = {};

            headers.forEach(function(header, index) {
                work[header] = values[index] ? values[index].trim() : "";
            });

            return work;
        });

        var grid = document.getElementById("works-grid");
        var categorySelect = document.getElementById("category");
        var sortSelect = document.getElementById("sort");

        function displayWorks() {
            var selectedCategory = categorySelect.value;
            var sortType = sortSelect.value;
            var filteredWorks = works.slice();

            if (selectedCategory !== "all") {
                filteredWorks = filteredWorks.filter(function(work) {
                    return work.category === selectedCategory;
                });
            }

            if (sortType === "new") {
                filteredWorks.sort(function(a, b) {
                    return Number(b.year) - Number(a.year);
                });
            } else if (sortType === "old") {
                filteredWorks.sort(function(a, b) {
                    return Number(a.year) - Number(b.year);
                });
            } else if (sortType === "title") {
                filteredWorks.sort(function(a, b) {
                    return a.title.localeCompare(b.title, "ja");
                });
            }

            grid.innerHTML = "";

            filteredWorks.forEach(function(work) {
                var card = document.createElement("article");
                card.className = "work-card";

                var link = document.createElement("a");
                link.href = work.link;

                var img = document.createElement("img");
                img.src = work.image;
                img.alt = work.title;

                img.onerror = function() {
                    console.error("画像を読み込めません:", img.src);
                };

                var info = document.createElement("div");
                info.className = "work-info";

                info.innerHTML =
                    '<p class="work-category">' + work.category + '</p>' +
                    '<h4>' + work.title + '</h4>' +
                    '<p>' + work.description + '</p>' +
                    '<p class="work-year">' + work.year + '</p>';

                link.appendChild(img);
                link.appendChild(info);
                card.appendChild(link);
                grid.appendChild(card);
            });
        }

        var categories = [];

        works.forEach(function(work) {
            if (!categories.includes(work.category)) {
                categories.push(work.category);
            }
        });

        categories.forEach(function(category) {
            var option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener("change", displayWorks);
        sortSelect.addEventListener("change", displayWorks);

        displayWorks();

    })
    .catch(function(error) {
        console.error("エラー:", error);
    });
