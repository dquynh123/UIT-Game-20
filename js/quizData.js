const uitQuizBank = [
    //1-10
    { 
        q: "UIT thành lập vào ngày tháng năm nào?", 
        options: ["08/06/2006", "10/10/2006", "01/01/2006", "19/05/2006"], 
        correct: "08/06/2006" 
    },
    { 
        q: "Tòa nhà nào được mệnh danh là 'trái tim' của UIT?", 
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"], 
        correct: "Tòa A" 
    },
    {
        q: "Trong C++, toán tử '%' dùng để làm gì?",
        options: ["Chia lấy phần nguyên", "Chia lấy phần dư", "Tính phần trăm", "Lấy địa chỉ"],
        correct: "Chia lấy phần dư"
    },
    { 
        q: "Ký hiệu của Khoa Kỹ thuật Máy tính tại UIT là gì?", 
        options: ["CE", "CS", "SE", "IS"], 
        correct: "CE" 
    },
    { 
        q: "Sân bóng đá cỏ nhân tạo của UIT nằm gần tòa nhà nào nhất?", 
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"], 
        correct: "Tòa E" 
    },
    { 
        q: "UIT là trường đại học thành viên thứ mấy của ĐHQG-HCM?", 
        options: ["Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"], 
        correct: "Thứ 6" 
    },
    { 
        q: "Trang web học tập trực tuyến chính thức của UIT có tên là gì?", 
        options: ["Moodle", "Courses", "LMS", "Edusoft"], 
        correct: "Courses" 
    },
    { 
        q: "Màu sắc chủ đạo trên logo của trường UIT là màu gì?", 
        options: ["Xanh dương và Trắng", "Đỏ và Trắng", "Xanh lá và Vàng", "Cam và Đen"], 
        correct: "Xanh dương và Trắng" 
    },
    { 
        q: "Tòa nhà nào tại UIT thường xuyên diễn ra các buổi lễ tốt nghiệp tại hội trường lớn?", 
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"], 
        correct: "Tòa A" 
    },
    { 
        q: "Chủ đề chính của kỷ niệm 20 năm thành lập UIT (2006-2026) là gì?", 
        options: ["Vững bước vươn xa", "Khát vọng dẫn đầu", "20 năm kiến tạo tương lai số", "Hành trình số hóa"], 
        correct: "20 năm kiến tạo tương lai số" 
    },
    // 11-20 
    { 
        q: "Tính đến năm 2026, UIT đã trải qua bao nhiêu năm hình thành và phát triển?", 
        options: ["10 năm", "15 năm", "20 năm", "25 năm"], 
        correct: "20 năm" 
    },
    { 
        q: "Slogan của UIT là gì?", 
        options: ["Vững kiến thức, giàu kỹ năng", "Toàn diện - Sáng tạo - Phụng sự", "Toàn diện - Phụng sự - Sáng tạo", "Tiên phong - Sáng tạo - Kết nối"], 
        correct: "Toàn diện - Sáng tạo - Phụng sự" 
    },
    { 
        q: "Tòa nhà nào tại UIT mới được đưa vào sử dụng gần đây nhất với thiết kế hiện đại và các phòng Lab chuyên sâu?", 
        options: ["Tòa nhà B", "Tòa nhà A", "Tòa nhà C", "Tòa nhà E"], 
        correct: "Tòa nhà E" 
    },
    { 
        q: "Tên tiếng anh chính thức của trường là gì?", 
        options: ["VNU-HCM IT University", "University of Information Technology", "HCMC University of Technology", "University of Computer Science"], 
        correct: "University of Information Technology" 
    },
    { 
        q: "UIT trực thuộc tổ chức giáo dục nào?", 
        options: ["ĐHQG-HN", "ĐHQG-HCM", "Bộ Giáo dục và Đào tạo", "ĐHQG-ĐN"], 
        correct: "ĐHQG-HCM" 
    },
    { 
        q: "UIT hiện có bao nhiêu khoa đào tạo chính?", 
        options: ["5", "6", "7", "8"], 
        correct: "6" 
    },
    { 
        q: "Tên viết tắt của Khoa Công nghệ Phần mềm tại UIT là gì?", 
        options: ["CE", "CS", "SE", "IS"], 
        correct: "SE" 
    },
    {
    q: "Ký hiệu của Khoa Hệ thống Thông tin tại UIT là gì?",
    options: ["CS", "IS", "SE", "CE"],
    correct: "IS"
    },
    {
    q: "Ký hiệu của Khoa Mạng máy tính và Truyền thông là gì?",
    options: ["NET", "CNM", "NC", "IT"],
    correct: "NC"
    },
    {
    q: "Hệ thống email chính thức cấp cho sinh viên UIT có đuôi mở rộng là gì?",
    options: ["@uit.edu.vn", "@student.uit.edu.vn", "@gm.uit.edu.vn", "@vnu.uit.edu.vn"],
    correct: "@gm.uit.edu.vn"
    },
    // 21-30 
    {
    q: "Ký hiệu của Khoa Khoa học và Kỹ thuật Thông tin là gì?",
    options: ["ISET", "KHKT", "INFO", "ISE"],
    correct: "ISET"
    },
    {
    q: "Trong môn Cấu trúc rời rạc, đồ thị có đường đi đi qua mỗi cạnh đúng một lần được gọi là gì?",
    options: ["Đồ thị Euler", "Đồ thị Hamilton", "Đồ thị đầy đủ", "Đồ thị phẳng"],
    correct: "Đồ thị Euler"
    },
    {
    q: "Thuật toán nào thường được dùng để tìm đường đi ngắn nhất giữa hai đỉnh trong đồ thị có trọng số không âm?",
    options: ["Dijkstra", "Prim", "Kruskal", "DFS"],
    correct: "Dijkstra"
    },
    {
    q: "Trong ngôn ngữ C++, hàm nào được dùng để giải phóng bộ nhớ cho một biến con trỏ đã cấp phát bằng 'new'?",
    options: ["free()", "delete", "remove", "clear"],
    correct: "delete"
    },
    {
    q: "Cấu trúc dữ liệu nào hoạt động theo nguyên tắc 'Vào trước ra trước' (FIFO)?",
    options: ["Ngăn xếp (Stack)", "Hàng đợi (Queue)", "Cây nhị phân", "Bảng băm"],
    correct: "Hàng đợi (Queue)"
    },
    {
    q: "Phép toán '10 % 3' trong hầu hết các ngôn ngữ lập trình trả về kết quả là bao nhiêu?",
    options: ["3", "3.33", "1", "0"],
    correct: "1"
    },
    {
    q: "Trong lập trình hướng đối tượng (OOP), tính chất nào giúp che giấu thông tin và ngăn chặn sửa đổi trực tiếp dữ liệu?",
    options: ["Tính kế thừa", "Tính đóng gói", "Tính đa hình", "Tính trừu tượng"],
    correct: "Tính đóng gói"
    },
    {
    q: "Câu lệnh 'int a = 5; a++;' sau khi thực thi thì giá trị của a là bao nhiêu?",
    options: ["4", "5", "6", "Error"],
    correct: "6"
    },
    {
    q: "Trong hệ nhị phân, số thập phân 5 được biểu diễn thành gì?",
    options: ["101", "110", "111", "011"],
    correct: "101"
    },
    {
    q: "Kiểu dữ liệu 'bool' trong lập trình chỉ có thể nhận những giá trị nào?",
    options: ["Số nguyên", "Số thực", "True hoặc False", "Chuỗi ký tự"],
    correct: "True hoặc False"
    },
    // 31-40
    {
    q: "Số 1 byte tương ứng với bao nhiêu bit?",
    options: ["4 bit", "8 bit", "16 bit", "32 bit"],
    correct: "8 bit"
    },
    {
    q: "Ngôn ngữ lập trình nào thường được giảng dạy đầu tiên cho sinh viên UIT để nắm vững tư duy lập trình?",
    options: ["Python", "PHP", "C/C++", "HTML"],
    correct: "C/C++"
    },
    {
    q: "Để lưu trữ danh sách các khoa (CS, IS, CE, SE, NC, ISET) vào một mảng trong C++, bạn cần khai báo kích thước mảng tối thiểu là bao nhiêu?",
    options: ["4", "5", "6", "7"],
    correct: "6"
    },
    {
    q: "Mã số sinh viên UIT có định dạng gồm 8 chữ số. Đây là kiểu dữ liệu nào phù hợp nhất để lưu trữ trong C++?",
    options: ["bool", "char", "int", "double"],
    correct: "int"
    },
    {
    q: "Trang web 'courses.uit.edu.vn' sử dụng giao thức HTTPS. Chữ 'S' ở cuối viết tắt của từ gì?",
    options: ["Simple", "Secure", "Speed", "Server"],
    correct: "Secure"
    },
    {
        q: "Trong kiến thức về Mạng máy tính, địa chỉ IP phiên bản 4 (IPv4) có độ dài bao nhiêu bit?",
        options: ["16 bit", "32 bit", "64 bit", "128 bit"],
        correct: "32 bit"
    },
    {
        q: "Trong OOP, khả năng của một đối tượng có thể thực hiện một hành động theo nhiều cách khác nhau được gọi là gì?",
        options: ["Tính đóng gói", "Tính kế thừa", "Tính đa hình", "Tính trừu tượng"],
        correct: "Tính đa hình"
    },
    {
        q: "Tính chất nào của OOP cho phép chúng ta tạo ra một lớp mới dựa trên các đặc điểm của một lớp đã có?",
        options: ["Tính đóng gói", "Tính kế thừa", "Tính đa hình", "Tính trừu tượng"],
        correct: "Tính kế thừa"
    },
    {
        q: "Trong OOP, tập hợp các đặc điểm (biến) và hành vi (phương thức) được gom nhóm lại thành một thực thể gọi là gì?",
        options: ["Function", "Object", "Class", "Pointer"],
        correct: "Class"
    },
    {
        q: "Hàm nào được gọi khi một đối tượng bị hủy để giải phóng bộ nhớ?",
        options: ["Constructor", "Destructor", "Delete", "Clear"],
        correct: "Destructor"
    },
    // 41-50 
    {
        q: "Ký hiệu của Khoa Khoa học Máy tính tại UIT là gì?",
        options: ["CS", "IS", "SE", "CE"],
        correct: "CS"
    },
    {
        q: "Trong OOP, tính chất nào cho phép chúng ta làm việc với các khái niệm tổng quát thay vì các chi tiết cụ thể?",
        options: ["Tính đóng gói", "Tính kế thừa", "Tính đa hình", "Tính trừu tượng"],
        correct: "Tính trừu tượng"
    },
    {
        q: "Tòa nhà nào tại UIT có thiết kế bao quanh một khoảng sân trời (giếng trời) lớn ở giữa?",
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
        correct: "Tòa C"
    },
    {
        q: "Trong mạng máy tính, thiết bị nào dùng để kết nối các mạng khác nhau và định tuyến dữ liệu?",
        options: ["Switch", "Hub", "Router", "Repeater"],
        correct: "Router"
    },
    {
        q: "Lệnh nào dùng để in ra màn hình trong C++?",
        options: ["cin", "cout", "print", "write"],
        correct: "cout"
    },
    {
        q: "Đơn vị nhỏ nhất của thông tin là gì?",
        options: ["Byte", "Bit", "RAM", "Pixel"],
        correct: "Bit"
    },
    {
        q: "Trong C++, thư viện nào dùng để nhập xuất dữ liệu cơ bản?",
        options: ["cmath", "iostream", "string", "iomanip"],
        correct: "iostream"
    },
    {
        q: "Lệnh nào dùng để kết thúc một vòng lặp ngay lập tức?",
        options: ["continue", "exit", "break", "return"],
        correct: "break"
    },
    {
        q: "Để lưu trữ một chuỗi ký tự trong C++, ta thường dùng thư viện nào?",
        options: ["<string>", "<char>", "<text>", "<iomanip>"],
        correct: "<string>"
    },
    {
        q: "Tại UIT, tòa nhà nào có hội trường lớn thường tổ chức các buổi Talkshow công nghệ?",
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
        correct: "Tòa A"
    },
    // 51-60
    {
    q: "Phòng Công tác Sinh viên của UIT nằm ở tòa nhà nào?",
    options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
    correct: "Tòa A"
    },
    {
    q: "UIT có bao nhiêu cơ sở đào tạo chính tính đến năm 2026?",
    options: ["1 cơ sở", "2 cơ sở", "3 cơ sở", "4 cơ sở"],
    correct: "1 cơ sở"
    },
    {
    q: "Khu vực tầng hầm của tòa nhà nào được sử dụng làm bãi giữ xe?",
    options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
    correct: "Tòa B"
    },
    {
    q: "Tại tòa E, văn phòng các Khoa thường nằm ở tầng mấy?",
    options: ["Tầng trệt", "Tầng 2 đến tầng 7", "Tầng 8 đến tầng 12", "Tầng thượng"],
    correct: "Tầng 8 đến tầng 12"
    },
    {
    q: "Chứng chỉ ngoại ngữ nào sau đây được UIT chấp nhận để xét tốt nghiệp?",
    options: ["IELTS", "TOEIC", "VSTEP", "Tất cả đều đúng"],
    correct: "Tất cả đều đúng"
    },
    {
    q: "Để liên hệ về các vấn đề học phí, sinh viên đến phòng nào tại tòa C?",
    options: ["Phòng Đào tạo", "Phòng Kế hoạch Tài chính", "Phòng Công tác Sinh viên", "Văn phòng Đoàn"],
    correct: "Phòng Kế hoạch Tài chính"
    },
    {
    q: "UIT có bao nhiêu kỳ thi tập trung chính trong một học kỳ?",
    options: ["1", "2", "3", "Không thi tập trung"],
    correct: "2"
    },
    {
    q: "Mỗi khi đến kỳ thi, địa điểm nào tại trường thường 'hết chỗ' đầu tiên?",
    options: ["Sân bóng", "Căn tin", "Thư viện", "Hành lang tòa C"],
    correct: "Thư viện"
    },
    {
    q: "UIT có liên kết đào tạo với Đại học Birmingham City tại quốc gia nào?",
    options: ["Mỹ", "Anh", "Úc", "Pháp"],
    correct: "Anh"
    },
    {
    q: "Số điện thoại đường dây nóng của UIT dùng để hỗ trợ tuyển sinh thường bắt đầu bằng?",
    options: ["028", "090", "012", "088"],
    correct: "028"
    },
    // 61-70
    {
    q: "Số lượng tòa nhà chính có tên bằng chữ cái tại UIT hiện nay là bao nhiêu?",
    options: ["3 tòa", "4 tòa", "5 tòa", "6 tòa"],
    correct: "5 tòa"
    },
    {
    q: "Để đăng ký cấp lại thẻ sinh viên bị mất, bạn cần liên hệ phòng nào?",
    options: ["Phòng Đào tạo", "Phòng Công tác Sinh viên", "Phòng Bảo vệ", "Căng tin"],
    correct: "Phòng Công tác Sinh viên"
    },
    {
    q: "Đâu là tên một phòng Lab nổi tiếng tại Khoa Mạng máy tính?",
    options: ["InSecLab", "GameLab", "WebLab", "SoftLab"],
    correct: "InSecLab"
    },
    {
    q: "Trung tâm Ngoại ngữ của UIT nằm ở đâu?",
    options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
    correct: "Tòa E"
    },
    {
    q: "Loại thẻ nào được dùng để vào Thư viện UIT?",
    options: ["Thẻ ngân hàng", "Thẻ sinh viên", "Thẻ căn cước", "Thẻ thư viện"],
    correct: "Thẻ sinh viên"
    },
    {
    q: "Địa chỉ website chính thức của trường UIT là gì?",
    options: ["uit.edu.vn", "uit.com", "vnu-uit.edu.vn", "dhcntt.edu.vn"],
    correct: "uit.edu.vn"
    },
    {
        q: "Trong C++, toán tử '==' dùng để làm gì?",
        options: ["Gán giá trị", "So sánh bằng", "So sánh khác", "Cộng thêm"],
        correct: "So sánh bằng"
    },
    {
        q: "Thiết bị nào được coi là 'não bộ' của máy tính?",
        options: ["RAM", "CPU", "Ổ cứng", "Nguồn"],
        correct: "CPU"
    },
    {
        q: "Đâu là một loại bộ nhớ trong (Primary Storage)?",
        options: ["USB", "RAM", "Thẻ nhớ", "SSD"],
        correct: "RAM"
    },
    {
        q: "Trong web, 'Frontend' là phần nào của ứng dụng?",
        options: ["Cơ sở dữ liệu", "Giao diện người dùng", "Server", "Mã nguồn ẩn"],
        correct: "Giao diện người dùng"
    },
    // 71-80
    {
        q: "Trong C++, kiểu dữ liệu nào dùng để lưu trữ một ký tự duy nhất?",
        options: ["string", "char", "int", "bool"],
        correct: "char"
    },
    {
        q: "Trong lập trình, 'Syntax Error' có nghĩa là lỗi gì?",
        options: ["Lỗi logic", "Lỗi cú pháp", "Lỗi tràn bộ nhớ", "Lỗi mạng"],
        correct: "Lỗi cú pháp"
    },
    {
        q: "Để ghi chú (comment) trên một dòng trong C++, ta dùng ký hiệu nào?",
        options: ["#", "/*", "//", "--"],
        correct: "//"
    },
    {
        q: "Trong C++, toán tử nào dùng để so sánh 'Lớn hơn hoặc bằng'?",
        options: [">", "=>", ">=", "=="],
        correct: ">="
    },
    {
        q: "Đâu là một loại ổ cứng giúp máy tính khởi động và mở ứng dụng nhanh hơn?",
        options: ["HDD", "SSD", "DVD", "Floppy Disk"],
        correct: "SSD"
    },
    {
        q: "Tại UIT, sinh viên muốn mượn sách hoặc học tập tập trung thường đến tòa nhà nào?",
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
        correct: "Tòa A"
    },
    {
        q: "Kiểu dữ liệu nào dùng để lưu trữ số thực (số có dấu phẩy động) trong C++?",
        options: ["int", "bool", "float", "char"],
        correct: "float"
    },
    {
        q: "Trong C++, từ khóa 'void' đặt trước tên hàm có ý nghĩa gì?",
        options: ["Hàm trả về số nguyên", "Hàm không trả về giá trị", "Hàm bị lỗi", "Hàm dùng cho số thực"],
        correct: "Hàm không trả về giá trị"
    },
    {
        q: "Ký hiệu '++' đặt trước hoặc sau biến (ví dụ: i++) có tác dụng gì?",
        options: ["Giảm giá trị đi 1", "Tăng giá trị lên 1", "Nhân giá trị với 2", "Giữ nguyên giá trị"],
        correct: "Tăng giá trị lên 1"
    },
    {
        q: "Trong lập trình, việc lặp lại một khối lệnh nhiều lần được thực hiện bởi cấu trúc nào?",
        options: ["Rẽ nhánh", "Vòng lặp", "Hàm", "Biến"],
        correct: "Vòng lặp"
    },
    // 81-90
    {
        q: "Trong lập trình Web, thẻ nào dùng để tạo một liên kết?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: "<a>"
    },
    {
        q: "Trong C++, toán tử '>>' thường được dùng với đối tượng nào để nhập dữ liệu?",
        options: ["cout", "cin", "printf", "scanf"],
        correct: "cin"
    },
    {
        q: "Đơn vị đo tốc độ xử lý của CPU thường là gì?",
        options: ["GB", "Mbps", "GHz", "Pixel"],
        correct: "GHz"
    },
    {
        q: "Dịch vụ DNS dùng để làm gì?",
        options: ["Gửi email", "Chuyển tên miền thành IP", "Bảo mật mạng", "Tăng tốc internet"],
        correct: "Chuyển tên miền thành IP"
    },
    {
        q: "Trong C++, lỗi 'Division by zero' (chia cho 0) thuộc loại lỗi nào?",
        options: ["Lỗi cú pháp", "Lỗi Runtime", "Lỗi biên dịch", "Lỗi Linker"],
        correct: "Lỗi Runtime"
    },
    {
        q: "Có bao nhiêu tính chất cơ bản trong OOP?",
        options: ["2", "3", "4", "5"],
        correct: "4"
    },
    {
        q: "Từ khóa nào dùng để đại diện cho chính đối tượng hiện tại trong C++?",
        options: ["that", "self", "this", "me"],
        correct: "this"
    },
    {
        q: "Phương thức đặc biệt dùng để khởi tạo đối tượng gọi là gì?",
        options: ["Constructor", "Destructor", "Setter", "Getter"],
        correct: "Constructor"
    },
    {
        q: "Một lớp có thể kế thừa từ nhiều lớp cha gọi là gì?",
        options: ["Đơn kế thừa", "Đa kế thừa", "Kế thừa đa mức", "Kế thừa hỗn hợp"],
        correct: "Đa kế thừa"
    },
    {
        q: "Phạm vi truy cập mặc định của 'class' trong C++ là gì?",
        options: ["public", "private", "protected", "internal"],
        correct: "private"
    },
    // 91-100
    {
        q: "Tòa nhà nào tại UIT có thiết kế hiện đại nhất và mới nhất?",
        options: ["Tòa A", "Tòa B", "Tòa C", "Tòa E"],
        correct: "Tòa E"
    },
    {
        q: "Tại UIT, thư viện có khu vực nào cho phép sinh viên thảo luận nhóm?",
        options: ["Phòng đọc yên tĩnh", "Khu vực sảnh", "Phòng tự học", "Phòng học nhóm"],
        correct: "Phòng học nhóm"
    },
    {
        q: "Trong C++, kiểu dữ liệu 'double' thường chiếm bao nhiêu byte?",
        options: ["2", "4", "8", "16"],
        correct: "8"
    },
    {
        q: "Trong C++, toán tử '++i' gọi là gì?",
        options: ["Hậu tố", "Tiền tố", "Trung tố", "Toán tử gán"],
        correct: "Tiền tố"
    },
    {
        q: "AI là viết tắt của cụm từ tiếng Anh nào?",
        options: ["Artificial Intelligence", "Auto Information", "Advanced Internet", "Apple Interface"],
        correct: "Artificial Intelligence"
    },
    {
        q: "Dung lượng 1 Terabyte (TB) bằng bao nhiêu Gigabyte (GB)?",
        options: ["100 GB", "512 GB", "1024 GB", "2048 GB"],
        correct: "1024 GB"
    },
    {
        q: "Tại UIT, 'Tuần sinh hoạt công dân' thường diễn ra vào lúc nào?",
        options: ["Cuối kỳ học", "Đầu mỗi năm học", "Trong kỳ nghỉ hè", "Vào ngày tốt nghiệp"],
        correct: "Đầu mỗi năm học"
    },
    {
        q: "Đâu là một loại tấn công mạng nhằm làm tê liệt hệ thống bằng cách gửi quá nhiều yêu cầu?",
        options: ["Phishing", "DDoS", "SQL Injection", "Trojan"],
        correct: "DDoS"
    },
    {
        q: "Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Vào sau ra trước)?",
        options: ["Hàng đợi (Queue)", "Ngăn xếp (Stack)", "Mảng", "Cây"],
        correct: "Ngăn xếp (Stack)"
    },
    {
        q: "Trong mạng máy tính, 'Subnet Mask' dùng để làm gì?",
        options: ["Tăng tốc độ mạng", "Phân chia địa chỉ mạng và host", "Bảo mật mật khẩu", "Phát sóng Wi-Fi"],
        correct: "Phân chia địa chỉ mạng và host"
    }
];