document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded'); // הודעת לוג לבדיקת טעינת הדף
  
    const deleteButtons = document.querySelectorAll('.delete-acc-btn');
    console.log('Delete buttons:', deleteButtons); // הודעת לוג לבדיקת הכפתורים
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', function () {
        console.log('Button clicked'); // הודעת לוג לבדיקת פעולה
        const row = this.closest('tr');
        console.log('Row to be deleted:', row); // הודעת לוג לבדיקת השורה
        if (row) {
          const confirmation = confirm("האם אתה בטוח שאתה רוצה למחוק?");
          if (confirmation) {
            row.remove();
            console.log('Row removed'); // הודעת לוג לאישור מחיקה
          } else {
            console.log('Row not removed'); // הודעת לוג לביטול מחיקה
          }
        }
      });
    });
  });document.addEventListener("DOMContentLoaded", function() {
    const deleteButtons = document.querySelectorAll(".delete_acc_btn");
    deleteButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        if (confirm("האם אתה בטוח שאתה רוצה למחוק?")) {
          // מחיקת השורה כאן
          const row = button.closest("tr");
          row.remove();
        }
      });
    });
  });
  
  $(document).ready(function() {
    // מאזין ללחיצה על כפתור האיקס
    $(".delete_acc_btn").on("click", function() {
      // הצגת הודעת השגיאה
      alert("האם אתה בטוח שאתה רוצה למחוק?");
    });
  });
    