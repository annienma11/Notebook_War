using UnityEngine;
using NotebookWar.Input;

namespace NotebookWar.Weapons
{
    public class WeaponSwitcher : MonoBehaviour
    {
        [Header("Weapon Setup")]
        [SerializeField] private WeaponBase[] weapons = new WeaponBase[6];
        [SerializeField] private float switchDelay = 0.3f;
        
        private int currentWeaponIndex = 0;
        private bool isSwitching = false;
        private IInputProvider input;

        private void Awake()
        {
            input = new KeyboardMouseInput();
            
            // Initialize weapons - only activate the first one
            for (int i = 0; i < weapons.Length; i++)
            {
                if (weapons[i] != null)
                {
                    weapons[i].gameObject.SetActive(i == currentWeaponIndex);
                }
            }
        }

        private void Update()
        {
            if (isSwitching) return;

            HandleWeaponSwitching();
        }

        private void HandleWeaponSwitching()
        {
            // Check for number key inputs (1-6)
            for (int i = 0; i < weapons.Length; i++)
            {
                if (input.GetWeaponSwitchInput(i + 1))
                {
                    SwitchToWeapon(i);
                    break;
                }
            }

            // Mouse wheel switching
            float scroll = input.GetScrollInput();
            if (scroll > 0f)
            {
                SwitchToNextWeapon();
            }
            else if (scroll < 0f)
            {
                SwitchToPreviousWeapon();
            }
        }

        public void SwitchToWeapon(int weaponIndex)
        {
            if (weaponIndex < 0 || weaponIndex >= weapons.Length) return;
            if (weapons[weaponIndex] == null) return;
            if (weaponIndex == currentWeaponIndex) return;
            if (isSwitching) return;

            StartCoroutine(SwitchWeaponCoroutine(weaponIndex));
        }

        public void SwitchToNextWeapon()
        {
            int nextIndex = (currentWeaponIndex + 1) % weapons.Length;
            
            // Find next available weapon
            for (int i = 0; i < weapons.Length; i++)
            {
                if (weapons[nextIndex] != null)
                {
                    SwitchToWeapon(nextIndex);
                    break;
                }
                nextIndex = (nextIndex + 1) % weapons.Length;
            }
        }

        public void SwitchToPreviousWeapon()
        {
            int prevIndex = currentWeaponIndex - 1;
            if (prevIndex < 0) prevIndex = weapons.Length - 1;
            
            // Find previous available weapon
            for (int i = 0; i < weapons.Length; i++)
            {
                if (weapons[prevIndex] != null)
                {
                    SwitchToWeapon(prevIndex);
                    break;
                }
                prevIndex--;
                if (prevIndex < 0) prevIndex = weapons.Length - 1;
            }
        }

        private System.Collections.IEnumerator SwitchWeaponCoroutine(int newWeaponIndex)
        {
            isSwitching = true;

            // Deactivate current weapon
            if (weapons[currentWeaponIndex] != null)
            {
                weapons[currentWeaponIndex].gameObject.SetActive(false);
            }

            // Wait for switch delay
            yield return new WaitForSeconds(switchDelay);

            // Activate new weapon
            currentWeaponIndex = newWeaponIndex;
            if (weapons[currentWeaponIndex] != null)
            {
                weapons[currentWeaponIndex].gameObject.SetActive(true);
            }

            isSwitching = false;
        }

        public WeaponBase GetCurrentWeapon()
        {
            if (currentWeaponIndex >= 0 && currentWeaponIndex < weapons.Length)
                return weapons[currentWeaponIndex];
            return null;
        }

        public int GetCurrentWeaponIndex() => currentWeaponIndex;
        
        public bool IsSwitching() => isSwitching;

        public void SetWeapon(int index, WeaponBase weapon)
        {
            if (index >= 0 && index < weapons.Length)
            {
                weapons[index] = weapon;
            }
        }

        public string GetCurrentWeaponName()
        {
            WeaponBase current = GetCurrentWeapon();
            return current != null ? current.name : "None";
        }
    }
}