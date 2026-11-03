# Tool Helper 1A — 0.12.0

## Cập nhật

Trong chrome://extensions, bấm Reload tiện ích rồi tải lại tab Altea. Bản này dùng service worker và quyền truy cập https://apilive.hanvietair.com để gọi hai API sau giữ vé. Chấp nhận quyền truy cập này nếu Chrome yêu cầu khi cập nhật. Mặc định công cụ thu gọn ở mép trái; bấm mũi tên để mở.

## Giữ vé chờ

1. Tiện ích nhận diện và chọn session ban đầu đang mở; không tạo session mới khi chọn module Giữ vé chờ. Có thể bấm Nhận diện lại session hiện tại nếu dữ liệu trang chưa tải xong. Không tự chuyển sang session mới được phát hiện sau đó.

Module mặc định là Giữ vé chờ; tiện ích vẫn thu gọn khi mới vào trang.
2. Nhập code, ví dụ anvn20novicnhan hoặc anvn20novicnhan*23novhanicn. Bấm Chạy code sẽ gửi IG trên session đang dùng, chờ phản hồi rồi mới gửi code. IG bỏ các thay đổi chưa lưu trong phiên theo yêu cầu sử dụng. Nếu IG lỗi/hết thời gian chờ, không gửi code và không tự thử lại.

Cũng có thể chọn nơi đi, nơi đến từ danh sách sân bay Hàn Quốc/Việt Nam và ngày đi/ngày về ngay trên ô code. Mỗi thay đổi sinh code xuống ô bên dưới; ngày về là tùy chọn, lượt về mặc định đảo chiều nơi đi/nơi đến. Các giá trị chưa chọn hiển thị trong ngoặc vuông và không được chạy cho đến khi chọn đủ. Sửa code trực tiếp sẽ chuyển sang dùng nội dung code, không phụ thuộc các ô chọn trước đó; chỉnh lại bất kỳ ô chọn nào sẽ tạo lại code theo form. Code thủ công vẫn hỗ trợ hành trình khác điểm đi/về.
3. Bảng loại KE/codeshare KE và phương án do Korean Air khai thác. Giữ tất cả hạng waitlist màu xám, và chỉ một hạng còn ghế thấp nhất màu xanh kèm số ghế. Cả hai loại đều bấm chọn được. Mặc định hạng thấp nhất là hạng còn ghế cuối cùng theo thứ tự Altea trả về; có thể nhập thứ tự từ cao đến thấp ở cài đặt. Không hiển thị hạng đóng/0 ghế. Các chặng nối trong một phương án có nền chung và đường phân cách mờ; giữa các phương án có đường đậm hơn.

Nút Giữ chỉ bật khi mỗi lượt bay trong code có một phương án được chọn đủ mọi chặng con. Code hai lượt phải có cả chiều đi và chiều về; số phương án từ 11 trở lên thuộc chiều về. Khi chọn phương án khác cùng chiều, toàn bộ lựa chọn của phương án cũ trong chiều đó bị bỏ. Điều kiện đủ chặng được kiểm tra lại khi xem lệnh và xác nhận gửi. Lệnh SS vẫn theo mẫu cấu hình người dùng cung cấp (mặc định PE), áp dụng cho cả hạng waitlist và hạng còn ghế được chọn.

Với phương án nối chuyến, chỉ hiển thị mã hạng khả dụng xuất hiện trên tất cả chặng con của phương án đó. Trong tập chung, giữ các hạng có waitlist trên ít nhất một chặng và thêm một hạng thấp nhất còn ghế trên mọi chặng. Hai chặng hiển thị cùng tập mã hạng; màu và số ghế vẫn theo trạng thái thực tế từng chặng. Hạng đóng/0 ghế trên bất kỳ chặng con nào bị loại. Không lấy giao hạng giữa các phương án hoặc chiều bay khác nhau. Không có hạng chung thì không thể chọn đủ chặng để giữ.

Bấm một hạng ở bất kỳ chặng con nào sẽ chọn cùng hạng cho tất cả chặng con trong phương án. Bấm lại hạng đang chọn sẽ bỏ chọn cả nhóm. Đổi phương án chỉ thay lựa chọn cùng chiều, giữ nguyên chiều còn lại.
4. Bấm Giữ để mở hộp thoại thông tin khách. Type cho API gồm ADT/VFR/STU, mặc định VFR, độc lập với loại khách ADT/CHD. Dùng nút ＋ để thêm khách, 🗑 để xóa. Trong thẻ ADT, nút ＋ INF thêm một em bé gắn với đúng người lớn đó. Mỗi ADT chỉ kèm một INF; xóa người lớn sẽ xóa INF đi kèm. Chuyển ADT sang CHD cũng bỏ INF đi kèm. CHD/INF bắt buộc có ngày sinh.
5. Bấm Giữ vé trong hộp thoại để thực hiện ngay; không có bước xem lệnh. Form khóa trong khi chạy để tránh gửi trùng. Lỗi xác thực hiển thị ngay trong form.

## Cài đặt ⚙

Các mẫu chọn chuyến, tên, danh sách lệnh email/SĐT, lệnh bổ sung, lệnh lưu PNR, lệnh sau lưu và regex thành công bổ sung được lưu bằng chrome.storage.local. Không lưu tên hành khách, ngày sinh, session hoặc nhật ký vào storage.

Mặc định theo mẫu người dùng cung cấp: chọn chuyến `SS{flight}{class}{date}{origin}{destination}PE{count}`, nối các chặng bằng ` *`. PE đếm tổng ADT + CHD, không đếm INF. Tên ADT có dạng `NM1{surname}/{givenName} {title}(ADT){infantSuffix}`; CHD có dạng `NM1{surname}/{givenName} {title}(CHD/{dob})`. INF là phần `(INF{surname}/{givenName} {title}/{dob})` gắn vào tên người lớn, không có NM1 riêng. Người lớn nam MR, nữ MRS; CHD/INF nam MSTR, nữ MISS. Ngày sinh DDMMMYY. Danh sách liên hệ mặc định gồm toàn bộ sáu lệnh APE/APM/APN đã cung cấp; lệnh bổ sung TK OK và RF HVA, lưu ER, sau lưu IG. Có thể sửa và lưu ở cài đặt. Cài đặt có giá trị đã sửa trước đây được giữ lại.

Chuỗi gửi chọn chuyến → tên từng ADT/CHD kèm INF → liên hệ → TK OK → RF HVA → ER → IG. Dừng khi phản hồi thiếu, có lỗi nhận diện được hoặc không khớp regex bổ sung nếu đã cấu hình. Không tự thử lại / rollback vì các bước trước có thể đã thay đổi PNR. Không gửi lại chuỗi booking cũ; muốn bắt đầu lượt khác, bấm Chạy code để gửi IG và tra lại trên cùng session. Sau phản hồi ER thành công, IG phải trả dạng IGNORED - EZZ8BA để xác định PNR; nếu ER có mã PNR thì kiểm tra khớp mã trong IG. Không gọi API khi thiếu/mâu thuẫn mã PNR. Nhận diện lỗi vẫn dựa trên văn bản; cần kiểm tra trạng thái thực tế trong Altea.

Sau IG thành công, đóng form, thu gọn công cụ và hiện thông báo chứa PNR. Service worker gọi POST /add-reprice với {pnrs: PNR, type: type đã chọn}, rồi POST /send với thông báo PNR và tên khách đầu tiên dạng HỌ/TÊN DANH_XƯNG. Hai request gửi đến apilive.hanvietair.com với credentials omit; không gửi cookie Altea. Không tự thử lại request nếu lỗi/hết 20 giây. Nếu API lỗi, PNR đã tạo vẫn được báo thành công kèm lỗi API riêng; không chạy lại lệnh giữ chỗ. Trong cùng một lần chạy service worker, cùng PNR được gộp request để tránh gửi lặp. Chưa có cơ chế idempotency xuyên qua việc service worker bị khởi động lại.

Code ghép dùng cú pháp `anvn20novicnhan*23novhanicn`. Dạng cũ lặp ANVN ở lượt sau vẫn được chấp nhận và tự chuyển sang cú pháp rút gọn trước khi gửi. Kết quả nhiều lượt được ánh xạ theo ngày và sân bay đến trên tiêu đề từng bảng AN; không đoán theo số dòng chuyến. Các hạng chưa xác định được ngày bị vô hiệu hóa. Khi chọn nhiều lượt bay, mẫu chọn chuyến phải dùng số hiệu, ngày, nơi đi/đến; không tái dùng số dòng availability đã cũ.

## Phiên và giới hạn

Giao diện phủ toàn bộ viewport trang chính bằng inset 0, sát mép phải và đáy; không đặt trong iframe. Trang nền tạm khóa cuộn khi công cụ mở, chỉ cuộn nội dung bên trong; thu nhỏ sẽ khôi phục cuộn trang. Bảng vẫn co giãn và các nhãn hạng tự xuống dòng. Số ghế hiển thị nguyên giá trị do Altea trả về.

Session đang dùng và nút nhận diện lại nằm ở chân giao diện bên trái, ngay trên nhật ký. Nội dung bảng cuộn riêng, phần chân giao diện vẫn hiện. Công cụ phóng ra/thu về vị trí mũi tên bằng một luồng animation transform/opacity (mở 340 ms, đóng 280 ms), không thay đổi kích thước bố cục mỗi khung hình. Chỉ ẩn giao diện và khôi phục cuộn trang sau khi đóng xong; đảo thao tác lấy tiếp từ khung hình hiện tại. Form khách, cài đặt và thông báo có hiệu ứng nhẹ riêng. Tôn trọng tùy chọn giảm chuyển động của hệ điều hành.

Quan sát fetch/XMLHttpRequest cùng origin để lấy context khởi tạo, gồm JSON và các object JavaScript có khóa không đặt trong dấu nháy. Đồng thời đọc context trong script inline và các thuộc tính dữ liệu của namespace aria/cryptic/context/session, iframe và popup cùng origin. Frame chuyển context lên bridge trang chính để dùng chung một giao diện. Không thực thi HTML/script trả về, không gọi getter và không gửi lệnh tự động để dò phiên. Nếu chưa có session, tự kiểm tra lại trong tối đa 60 giây; sau đó có thể nhận diện lại bằng nút trên giao diện. Nếu context chỉ nằm trong closure riêng không truy cập được, cần phản hồi khởi tạo thực tế để bổ sung bộ đọc. Cookie tự đính bằng credentials include với request Altea; không đọc/xuất cookie. PNR/type và PNR/tên khách đầu tiên được gửi đến hai API Hanvietair sau thành công theo yêu cầu.

Kênh MAIN/page có thể được chính trang đọc hoặc thay đổi; không là ranh giới bảo mật với trang chủ. Kết quả lệnh không tự cập nhật màn hình cryptic của Altea. Đóng session có HTTPSessionDestroyed sẽ xóa mục tương ứng.

## Kiểm tra

node availability.test.js
node booking.test.js

node bridge.test.js

node selection.test.js

node search-flow.test.js

node completion.test.js

Bộ kiểm tra dùng phản hồi mẫu và chuỗi SS/NM1/liên hệ người dùng cung cấp, kiểm tra nhiều hành khách, PE không đếm INF, gắn INF với ADT, ngày sinh, PNR từ IG và payload của hai API bằng fetch giả. Chưa gọi API thật và chưa kiểm thử tích hợp với tài khoản Altea.
