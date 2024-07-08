document.addEventListener('DOMContentLoaded', function () {
  console.log('Document loaded'); // לוג לבדיקת טעינת הדף

  const deleteButtons = document.querySelectorAll('.delete-acc-btn');
  console.log('Delete buttons:', deleteButtons); // לוג לבדיקת הכפתורים

  deleteButtons.forEach(button => {
      button.addEventListener('click', function () {
          console.log('Button clicked'); // לוג לבדיקת פעולה
          const row = this.closest('tr');
          console.log('Row to be deleted:', row); // לוג לבדיקת השורה
          if (row) {
              const confirmation = confirm("האם אתה בטוח שאתה רוצה למחוק?");
              if (confirmation) {
                  row.remove();
                  console.log('Row removed'); // לוג לאישור מחיקה
              } else {
                  console.log('Row not removed'); // לוג לביטול מחיקה
              }
          }
      });
  });
});
$(document).ready(function() {
  // מאזין ללחיצה על כפתורי מחיקה
  $(".delete-acc-btn").on("click", function() {
      // הצגת הודעת אישור
      if (confirm("האם אתה בטוח שאתה רוצה למחוק?")) {
          // מחיקת השורה
          const row = $(this).closest("tr");
          row.remove();
      }
  });
});
